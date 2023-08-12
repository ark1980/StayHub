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

// Get all Reviews of the Current User =================================================
router.get("/current", requireAuth, async (req, res, next) => {
  const reviews = {};

  const currentReview = await Review.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "username", "lastName"],
      },
      {
        model: Spot,
        attributes: { exclude: ["description", "createdAt", "updatedAt"] },
        include: [
          {
            model: SpotImage,
            attributes: ["url", "preview"],
          },
        ],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
    where: { userId: req.user.id },
  });

  const curReviewArr = [];
  for (let review of currentReview) {
    curReviewArr.push(review.toJSON());
  }

  curReviewArr.forEach((item) => {
    item.Spot.SpotImages.forEach((img) => {
      if (img.preview === true) {
        item.Spot.previewImage = img.url;
      }
    });
    if (!item.Spot.previewImage) {
      item.Spot.previewImage = "no preview image found";
    }
    delete item.Spot.SpotImages;
  });

  reviews["Reviews"] = curReviewArr;
  res.json(reviews);
});

module.exports = router;
