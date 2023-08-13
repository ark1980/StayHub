const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth");
const { Spot, SpotImage, sequelize } = require("../../db/models");
const { Op } = require("sequelize");

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const spotImage = await SpotImage.findByPk(req.params.imageId);

  if (!spotImage) {
    const err = new Error("Spot Image couldn't be found");
    err.status = 404;
    return next(err);
  }

  const spot = await Spot.findByPk(spotImage.spotId);

  if (spot.ownerId === req.user.id) {
    await spotImage.destroy();
    return res.json({
      message: "Successfully deleted",
    });
  } else {
    res.status(400);
    return res.json({ message: "Must be owner of Spot to delete Image" });
  }

  //error handler
router.use((err, req, res, next) => {
    res.status(err.statusCode || 500);
    res.send({
      message: err.message,
    });
  });
});

module.exports = router;
