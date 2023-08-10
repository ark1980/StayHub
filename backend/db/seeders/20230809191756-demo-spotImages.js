"use strict";

const { SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(
      [
        {
          spotId: 1,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-704995305925496272/original/c7605da4-fbe0-45df-b3ba-e4314bde6b13.jpeg?im_w=960",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-704995305925496272/original/fd58b617-d2bd-4fdd-a0f7-b8c8c4bcec10.jpeg?im_w=720",
          preview: false,
        },
        {
          spotId: 1,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-704995305925496272/original/6d0ffc27-8386-4b4d-89f8-bb711c862e0a.jpeg?im_w=720",
          preview: false,
        },
        {
          spotId: 1,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-704995305925496272/original/3509c0a1-8b57-4384-ae1a-c754ad514c19.jpeg?im_w=720",
          preview: false,
        },
        {
          spotId: 1,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-704995305925496272/original/28598c14-2b06-4315-965e-be6badb445dc.jpeg?im_w=720",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-894368185789160324/original/63ec8153-1590-4f4f-9a73-ffb69a9d7b0e.png?im_w=960",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-894368185789160324/original/5223ff1b-f76c-49fe-ac35-8cc99a352283.png?im_w=720",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-894368185789160324/original/c951d8b8-904e-4471-80d2-5f698be30231.png?im_w=720",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-894368185789160324/original/bab17ef0-a681-4579-a055-cdb9619c5048.png?im_w=720",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-894368185789160324/original/0d817ffc-4252-4c52-9bc2-bba78c64c831.png?im_w=720",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-890431857107940707/original/a058dea9-609f-4f25-a30b-da6e469aae78.jpeg?im_w=960",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://a0.muscache.com/im/pictures/4eae08b4-5796-49c6-bfc0-edce94310772.jpg?im_w=720",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://a0.muscache.com/im/pictures/bb6522c8-c999-452d-96af-2d7c3367ce31.jpg?im_w=720",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://a0.muscache.com/im/pictures/0f252644-542e-41c4-8b43-f6b1efccbafd.jpg?im_w=720",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-890431857107940707/original/3f9512a7-71ea-483b-a929-f49b90c61cf9.jpeg?im_w=720",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-696199818482026210/original/726dbbe8-ba22-4c54-8c78-ae8b425190eb.jpeg?im_w=960",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-696199818482026210/original/227b82a0-8af4-4d6c-b96f-ee9d3fe66736.jpeg?im_w=720",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-696199818482026210/original/00b36425-1f76-4f9c-9a16-3f19a964158f.jpeg?im_w=720",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-696199818482026210/original/6d4cd816-6998-4f0b-81e9-b05a7137664c.jpeg?im_w=720",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-696199818482026210/original/606ee141-0410-4a9b-a70e-15979b30cc50.jpeg?im_w=720",
          preview: false,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        preview: {
          [Op.in]: [true, false],
        },
      },
      {}
    );
  },
};
