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

// Add an Image to a Review based on the Review's id -----------------------------
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  let reviewExist = await Review.findByPk(req.params.reviewId);

  if (!reviewExist) {
    const err = new Error("Review couldn't be found");
    err.status = 404;
    return next(err);
  }

  let reviewUserMatch = await Review.findByPk(req.params.reviewId, {
    where: { userId: req.user.id },
  });

  if (reviewUserMatch.toJSON().userId !== req.user.id) {
    const err = new Error("Review must belong to current user");
    err.status = 400;
    return next(err);
  }

  // add image to review (if none of the above checks are hit)
  let reviewIdNum = Number(req.params.reviewId);
  let newImg = await ReviewImage.create({
    reviewId: reviewIdNum,
    ...req.body,
  });

  let finalImg = newImg.toJSON();

  delete finalImg.createdAt;
  delete finalImg.updatedAt;
  delete finalImg.reviewId;

  res.json(finalImg);
});

// Edit Review +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.put("/:reviewId", requireAuth, async (req, res, next) => {
  //review must exist
  let reviewExist = await Review.findByPk(req.params.reviewId);

  if (!reviewExist) {
    const err = new Error("Review couldn't be found");
    err.status = 404;
    return next(err);
  }

  //user-review match check: review must belong to the current user
  let reviewUserMatch = await Review.findByPk(req.params.reviewId, {
    where: { userId: req.user.id },
  });

  if (!reviewUserMatch) {
    const err = new Error("Review must belong to current user");
    err.status = 400;
    return next(err);
  }

  // validation checks:
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

  //if all checks passed: edit review
  await reviewExist.update({ ...req.body });

  let finalReview = reviewExist.toJSON();

  return res.json(finalReview);
});

// Delete Review =========================================================
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  //review must exist
  let review = await Review.findByPk(req.params.reviewId);

  if (!review) {
    const err = new Error("Review couldn't be found");
    err.status = 404;
    return next(err);
  }

  //user-review match check: review must belong to the current user
  let reviewUserMatch = await Review.findByPk(req.params.reviewId, {
    where: { userId: req.user.id },
  });

  if (!reviewUserMatch) {
    const err = new Error("Review must belong to current user");
    err.status = 400;
    return next(err);
  }

  //delete the review
  await review.destroy();

  res.json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

//error handler
router.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.send({
    error: err.message,
  });
});

module.exports = router;
