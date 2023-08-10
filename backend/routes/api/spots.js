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

// All spots
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
        spotId: spotId,
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
});

//error handler - maybe delete and include in each endpoint
router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: err.message,
  });
});

module.exports = router;
