"use strict";

const { ReviewImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(
      [
        {
          reviewId: 1,
          url: "www.pic10.com",
        },
        {
          reviewId: 1,
          url: "www.pic20.com",
        },
        {
          reviewId: 1,
          url: "www.pic30.com",
        },
        {
          reviewId: 2,
          url: "www.pic10.com",
        },
        {
          reviewId: 2,
          url: "www.pic20.com",
        },
        {
          reviewId: 2,
          url: "www.pic30.com",
        },
        {
          reviewId: 3,
          url: "www.pic30.com",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  },
};
