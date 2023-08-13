const express = require("express");
const router = express.Router();

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
  Spot,
  User,
  SpotImage,
  Review,
  ReviewImage,
  Booking,
  sequelize,
} = require("../../db/models");
const { Op } = require("sequelize");

// All of the Current User's Bookings +++++++++++++++++++++++++++++++++++++
router.get("/current", requireAuth, async (req, res) => {
  const allBookings = await Booking.findAll({
    where: { userId: req.user.id },
    include: [
      {
        model: Spot,
        attributes: { exclude: ["createdAt", "updatedAt", "description"] },
        include: [{ model: SpotImage }],
      },
    ],
  });

  const bookings = allBookings.map((booking) => {
    const bookingJSON = booking.toJSON();

    const previewImage = bookingJSON.Spot.SpotImages.find(
      (spotImage) => spotImage.preview
    );
    bookingJSON.Spot.previewImage = previewImage ? previewImage.url : null;

    delete bookingJSON.Spot.SpotImages;

    return {
      id: bookingJSON.id,
      spotId: bookingJSON.spotId,
      Spot: bookingJSON.Spot,
      userId: bookingJSON.userId,
      startDate: bookingJSON.startDate,
      endDate: bookingJSON.endDate,
      createdAt: bookingJSON.createdAt,
      updatedAt: bookingJSON.updatedAt,
    };
  });

  res.json({ Bookings: bookings });
});

// Edit Booking -----------------------------------------------------------

router.put("/:bookingId", requireAuth, async (req, res, next) => {
  const booking = await Booking.findByPk(req.params.bookingId);

  //if booking id doesn't exist throw error
  if (!booking) {
    const err = new Error("Booking couldn't be found");
    err.status = 404;
    next(err);
  }

  // Must be owner of booking in order to update booking
  const userIdNum = booking.toJSON().userId;
  if (userIdNum !== req.user.id) {
    res.status(400);
    return res.json({ message: "Must be owner of Spot to update spot" });
  }

  // Pull out existing start and end date
  const { startDate, endDate } = req.body;
  const startDateData = new Date(startDate);
  const endDateData = new Date(endDate);

  // Error for editing end date before start date
  /// STILL NEED TO SOLVE THIS
  if (endDateData < startDateData) {
    const err = new Error("endDate cannot come before startDate");
    err.status = 400;
    next(err);
    return;
  }

  //Error for attempting to edit a past booking
  //can't delete booking that is in the past
  const bookingObj = booking.toJSON();
  const currentTimeMS = Date.now();
  const endTime = bookingObj.endDate;
  const endTimeMS = endTime.getTime();

  const dateCalc = endTimeMS - currentTimeMS;

  if (dateCalc < 0) {
    const err = new Error("Past bookings can't be modified");
    err.status = 403;
    next(err);
    return;
  }
  //Error for if new dates have a booking conflict
  //Time range must be open (aka no overlapping booking date)
  const spotBookings = await Spot.findByPk(bookingObj.spotId, {
    include: { model: Booking },
  });

  const spotBookingsObj = spotBookings.toJSON();
  const bookingsArr = spotBookingsObj.Bookings;

  //loop through all bookings
  for (i = 0; i < bookingsArr.length; i++) {
    let existingBookingStartDate = bookingsArr[i].startDate;
    let existingBookingEndDate = bookingsArr[i].endDate;

    //check if NEW start date falls between start and end date. Throw error if so.
    // if (startDateData > )
    if (
      startDateData >= existingBookingStartDate &&
      startDateData <= existingBookingEndDate
    ) {
      const err = new Error(
        "Sorry, this spot is already booked for the specified dates"
      );
      err.status = 403;
      next(err);
      return;
    }

    // check if NEW end date falls between start and end date. Throw error if so.
    if (
      endDateData >= existingBookingStartDate &&
      endDateData <= existingBookingEndDate
    ) {
      const err = new Error(
        "Sorry, this spot is already booked for the specified dates"
      );
      err.status = 403;
      next(err);
      return;
    }

    // if start date is before start date, check if end date is after end date
    if (
      startDateData <= existingBookingStartDate &&
      endDateData >= existingBookingEndDate
    ) {
      const err = new Error(
        "Sorry, this spot is already booked for the specified dates"
      );
      err.status = 403;
      next(err);
      return;
    }
  }

  // If pass all checks above, update booking:
  await booking.update({ ...req.body });

  res.json(booking);
});

router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  const booking = await Booking.findByPk(req.params.bookingId);

  // throw error if booking id doesn't exist
  if (!booking) {
    const err = new Error("Booking couldn't be found");
    err.status = 404;
    next(err);
  }

  // Must be owner of booking
  const userIdNum = booking.toJSON().userId;
  if (userIdNum !== req.user.id) {
    res.status(400);
    return res.json({ message: "Must be owner of Booking to delete" });
  }

  //can't delete booking that is in the past
  const bookingObj = booking.toJSON();
  const currentTimeMS = Date.now();
  const startTime = bookingObj.startDate;
  const startTimeMS = startTime.getTime();

  const dateCalc = startTimeMS - currentTimeMS;

  if (dateCalc < 0) {
    const err = new Error("Bookings that have been started can't be deleted");
    err.status = 403;
    next(err);
    return;
  }

  // Delete booking ============================================================
  await booking.destroy();

  res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
