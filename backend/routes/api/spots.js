const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth");
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

router.get("/", async (req, res, next) => {
  const {
    page = 1,
    size = 20,
    minLat,
    maxLat,
    minLng,
    maxLng,
    minPrice,
    maxPrice,
  } = req.query;

  if (page < 1) {
    const err = new Error("Page can not be 0")
    res.status(400)
    return next(err);
  }

  if (size < 1) {
    const err = new Error("Size can not be 0")
    res.status(400)
    return next(err);
  }

  // Validate query parameters
  if (
    (minLat && isNaN(minLat)) ||
    (maxLat && isNaN(maxLat)) ||
    (minLng && isNaN(minLng)) ||
    (maxLng && isNaN(maxLng)) ||
    (minPrice && isNaN(minPrice)) ||
    (maxPrice && isNaN(maxPrice))
  ) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }

  // Build filters based on query parameters
  const filters = {};
  if (minLat || maxLat) {
    filters.lat = {};
    if (minLat) filters.lat[Op.gte] = minLat;
    if (maxLat) filters.lat[Op.lte] = maxLat;
  }
  if (minLng || maxLng) {
    filters.lng = {};
    if (minLng) filters.lng[Op.gte] = minLng;
    if (maxLng) filters.lng[Op.lte] = maxLng;
  }
  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price[Op.gte] = minPrice;
    if (maxPrice) filters.price[Op.lte] = maxPrice;
  }

  // Apply querry filters
  const spots = await Spot.findAll({
    where: filters,
    order: [["id"]],
    limit: +size,
    offset: (+page - 1) * +size,
    attributes: [
      "id",
      "ownerId",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "description",
      "price",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: SpotImage,
        attributes: ["url"],
        where: {
          preview: true,
        },
        required: false,
      },
    ],
  });

  const responseSpots = spots.map((spot) => ({
    ...spot.toJSON(),
    previewImage: spot.SpotImages[0]?.url || null,
    SpotImages: undefined, // Remove the SpotImages array from the response
  }));

  res.json({
    Spots: responseSpots,
    page: +page,
    size: +size,
  });
});

// Get all spots ======================================================
// router.get("/", async (req, res, next) => {
//   const spots = {};
//   const allSpots = await Spot.findAll();
//   const spotsList = [];

//   // Add Pagination ++++++++++++++++====================++++++++++++++++
//   let { page = 1, size = 20 } = req.query;
//   let pagination = {};
//   // if (!page) page = 1;
//   // if (!size) size = 20;

//   //page and size restrictions
//   if (page < 1) {
//     const err = new Error("Page must be greater than or equal to 1");
//     err.status = 403;
//     return next(err);
//   }
//   if (page > 10) page = 10;

//   if (size < 1) {
//     const err = new Error("Size must be greater than or equal to 1");
//     err.status = 403;
//     return next(err);
//   }
//   if (size > 20) size = 20;

//   if (page >= 1 && size >= 1) {
//     pagination.limit = size;
//     pagination.offset = size * (page - 1);
//   }
//   // ============== ++++++++++++++++=====================++++++++++++++++

//   allSpots.forEach((spot) => {
//     spotsList.push(spot.toJSON());
//   });

//   //add Avg rating to each spot
//   for (let i = 0; i < spotsList.length; i++) {
//     let spotId = spotsList[i]["id"];
//     const starRating = await Review.findOne({
//       where: { spotId },
//       attributes: [
//         [sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"],
//       ],
//     });

//     const reviewJson = starRating.toJSON();

//     spotsList[i].avgRating = reviewJson.avgStarRating;
//   }

//   //add preview Image to each spot
//   for (let i = 0; i < spotsList.length; i++) {
//     let spotId = spotsList[i]["id"];
//     const spotImg = await SpotImage.findOne({
//       where: {
//         spotId,
//         preview: true,
//       },
//       attributes: ["url", "preview"],
//     });

//     if (!spotImg) spotsList[i].previewImage = "no preview image found";

//     if (spotImg) {
//       const previewImg = spotImg.toJSON();
//       spotsList[i].previewImage = previewImg.url;
//     }
//   }

//   spots.Spots = spotsList;

//   const pageNum = Number(page)
//   const sizeNum = Number(size)

//   spots.page = pageNum
//   spots.size = sizeNum

//   res.json(spots);
//   next();
// });

// Get all Spots owned by the Current User =====================================
router.get("/current", requireAuth, async (req, res, next) => {
  const spotsList = [];
  const spots = {};
  const userId = req.user.id;

  const allSpots = await Spot.findAll({
    include: [{ model: SpotImage }],
    where: { ownerId: userId },
  });

  // convert each spot to a JSON object
  allSpots.forEach((spot) => {
    spotsList.push(spot.toJSON());
  });

  //add Avg rating to each spot
  for (let i = 0; i < spotsList.length; i++) {
    let spotId = spotsList[i]["id"];
    const starRating = await Review.findOne({
      where: { spotId },
      attributes: [
        [sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"],
      ],
    });

    const reviewJson = starRating.toJSON();

    spotsList[i].avgRating = reviewJson.avgStarRating;
  }

  //add previewImage to each spot
  spotsList.forEach((spot) => {
    spot.SpotImages.forEach((img) => {
      if (img.preview === true) {
        spot.previewImage = img.url;
      }
    });
    if (!spot.previewImage) {
      spot.previewImage = "no preview image found";
    }
    delete spot.SpotImages;
  });

  spots["Spots"] = spotsList;
  res.json(spots);
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// GET ALL BOOKINGS FROM SPOT BASED ON SPOTS ID
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  // check if spot exists
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  //if not owner of the spot, they can see only booking start and end time and spotid
  const ownerIdObj = await Spot.findByPk(req.params.spotId, {
    attributes: ["ownerId"],
  });

  const ownerIdNum = ownerIdObj.toJSON().ownerId;

  if (ownerIdNum !== req.user.id) {
    const Bookings = await Booking.findAll({
      where: { spotId: req.params.spotId },
      attributes: { exclude: ["id", "userId", "createdAt", "updatedAt"] },
    });

    return res.json({ Bookings });
  } else {
    const Bookings = await Booking.findAll({
      where: { spotId: req.params.spotId },
      include: {
        model: User,
        attributes: {
          exclude: [
            "username",
            "hashedPassword",
            "email",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    });

    return res.send({ Bookings });
  }
});

// CREATE A BOOKING FOR A SPOT BASED ON THE SPOT'S ID

router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
  // check if spot exists
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  //spot CANNOT belong to current user
  const ownerIdObj = await Spot.findByPk(req.params.spotId, {
    attributes: ["ownerId"],
  });

  const ownerIdNum = ownerIdObj.toJSON().ownerId;

  if (ownerIdNum === req.user.id) {
    res.status(403);
    return res.json({
      message: "Owners cannot make booking to their own spot",
    });
  }

  //EndDate cannot be on or before start date
  const { startDate, endDate } = req.body;
  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);

  if (newEndDate.getTime() - newStartDate.getTime() < 0) {
    const err = new Error("endDate cannot be on or before startDate");
    err.status = 403;
    next(err);
    return;
  }

  //Time range must be open (aka no overlapping booking date)
  const spotBookings = await Spot.findByPk(req.params.spotId, {
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
      newStartDate >= existingBookingStartDate &&
      newStartDate <= existingBookingEndDate
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
      newEndDate >= existingBookingStartDate &&
      newEndDate <= existingBookingEndDate
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
      newStartDate <= existingBookingStartDate &&
      newEndDate >= existingBookingEndDate
    ) {
      const err = new Error(
        "Sorry, this spot is already booked for the specified dates"
      );
      err.status = 403;
      next(err);
      return;
    }
  }

  //If pass all checks above, then create new booking:
  const spotIdNum = Number(req.params.spotId);
  const newBooking = await Booking.create({
    spotId: spotIdNum,
    userId: req.user.id,
    ...req.body,
  });

  res.json(newBooking);
});

// Get all Reviews by Spot's id ++++++++++++++++++++++++++++++++++++++++++++
router.get("/:id/reviews", requireAuth, async (req, res, next) => {
  const reviews = {};
  const allReviews = await Review.findAll({
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      { model: ReviewImage, attributes: ["id", "url"] },
    ],
    where: { spotId: req.params.id },
  });

  if (allReviews.length === 0) {
    const err = new Error();
    err.message = "Spot couldn't be found";
    err.statusCode = 404;
    return next(err);
  }

  reviews["Reviews"] = allReviews;
  res.json(reviews);
});
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Create a Review for a Spot based on the Spot's id -----------------------
router.post("/:spotId/reviews", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  // validation checks
  const { review, stars } = req.body;
  if (!review) {
    const err = new Error("Review text is required");
    err.status = 400;
    return next(err);
  }

  if (stars < 1 || stars > 5) {
    const err = new Error("Stars must be an integer from 1 to 5");
    err.status = 400;
    return next(err);
  }

  //check if user already has a review for this spot
  const reviewsOnSpot = await Review.findOne({
    where: {
      spotId: req.params.spotId,
      userId: req.user.id,
    },
  });
  ``;

  if (reviewsOnSpot) {
    const err = new Error("User already has a review for this spot");
    err.status = 403;
    return next(err);
  }

  const spotIdNum = Number(req.params.spotId);
  const newReview = await Review.create({
    spotId: spotIdNum,
    userId: req.user.id,
    ...req.body,
  });

  res.json(newReview);
});
// -------------------------------------------------------------------------

router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  //throws error if spotId doesnt exist
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  const newSpotImg = await SpotImage.create({
    spotId: req.params.spotId,
    ...req.body,
  });

  //spot must belong to current user
  const ownerIdObj = await Spot.findByPk(req.params.spotId, {
    attributes: ["ownerId"],
  });

  const ownerIdNum = ownerIdObj.toJSON().ownerId;

  if (ownerIdNum !== req.user.id) {
    res.status(400);
    return res.json({ message: "Must be owner of Spot to post image" });
  }

  const spotImg = newSpotImg.toJSON();

  delete spotImg.updatedAt;
  delete spotImg.createdAt;
  delete spotImg.spotId;

  res.json(spotImg);
});

router.put("/:spotId", async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  //if spot id doesn't exist throw error
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;

    next(err);
  }

  //Must be owner of spot in order to update spot
  const ownerIdObj = await Spot.findByPk(req.params.spotId, {
    attributes: ["ownerId"],
  });

  const ownerIdNum = ownerIdObj.toJSON().ownerId;

  if (ownerIdNum !== req.user.id) {
    res.status(400);
    return res.json({ message: "Must be owner of Spot to update spot" });
  }

  await spot.update({ ...req.body });

  const finalSpot = spot.toJSON();

  delete finalSpot.updatedAt;
  delete finalSpot.createdAt;
  delete finalSpot.id;
  delete finalSpot.ownerId;

  return res.json(finalSpot);
});

router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  //if spot id doesn't exist throw error
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  //Must be owner of spot in order to update spot
  const ownerIdObj = await Spot.findByPk(req.params.spotId, {
    attributes: ["ownerId"],
  });

  const ownerIdNum = ownerIdObj.toJSON().ownerId;

  if (ownerIdNum !== req.user.id) {
    res.status(400);
    return res.json({ message: "Must be owner of Spot to delete spot" });
  }

  // Delete the spot
  await spot.destroy();
  return res.json({
    message: "The spot successfully deleted",
  });
});

router.get("/:spotId", async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    next(err);
  }

  const numReviews = await Review.count({
    where: { spotId: spot.id },
  });

  const starRating = await Review.findOne({
    where: { spotId: spot.id },
    attributes: [
      [sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"],
    ],
  });

  const reviewJson = starRating.toJSON();

  const newSpot = spot.toJSON();

  newSpot.numReviews = numReviews;
  newSpot.avgStarRating = reviewJson.avgStarRating;

  res.json(newSpot);
});

router.post("/", requireAuth, async (req, res) => {
  const newSpot = await Spot.create({
    ownerId: req.user.id,
    ...req.body,
  });

  res.json(newSpot);
});

//error handler
router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    message: err.message,
  });
});

module.exports = router;
