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

// Get all spots ======================================================
router.get("/", async (req, res, next) => {
  const spots = {};
  const allSpots = await Spot.findAll();
  const spotsList = [];

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

  //add preview Image to each spot
  for (let i = 0; i < spotsList.length; i++) {
    let spotId = spotsList[i]["id"];
    const spotImg = await SpotImage.findOne({
      where: {
        spotId,
        preview: true,
      },
      attributes: ["url", "preview"],
    });

    if (!spotImg) spotsList[i].previewImage = "no preview image found";

    if (spotImg) {
      const previewImg = spotImg.toJSON();
      spotsList[i].previewImage = previewImg.url;
    }
  }

  spots.Spots = spotsList;

  res.json(spots);
  next();
});

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

module.exports = router;
