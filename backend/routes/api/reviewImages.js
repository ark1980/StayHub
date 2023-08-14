const express = require("express");
const router = express.Router();

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
  Review,
  ReviewImage,
  sequelize,
} = require("../../db/models");
const { Op } = require("sequelize");

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const image = await ReviewImage.findByPk(req.params.imageId, {
    include: { model: Review },
  });
  //if spot id doesn't exist throw error
  if (!image) {
    const err = new Error("Review Image couldn't be found");
    err.status = 404;
    next(err);
  }

  const userIdNum = image.toJSON().Review.userId;

  if (userIdNum !== req.user.id) {
    res.status(400);
    return res.json({ message: "Ownership of the review is necessary to delete the image." });
  }

  //delete image
  await image.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
