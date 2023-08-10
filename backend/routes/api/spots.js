const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const { requireAuth } = require("../../utils/auth");
const { User, Spot } = require("../../db/models");

router.get("/" , async (req, res, next) => {
    const allSpots = await Spot.findAll();
    console.log(allSpots);
    res.json(allSpots);
})

module.exports = router;