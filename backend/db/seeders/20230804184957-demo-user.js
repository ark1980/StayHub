"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          firstName: "Demo",
          lastName: "Lition",
          email: "demo@user.com",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Jamse",
          lastName: "Henderson",
          email: "james@email.io",
          username: "James10",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "Mike",
          lastName: "Lee",
          email: "mike@user.dev",
          username: "Mike100",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          firstName: "Jenny",
          lastName: "Smith",
          email: "jene@user.ai",
          username: "Jenny20",
          hashedPassword: bcrypt.hashSync("password3"),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: { [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"] },
      },
      {}
    );
  },
};
