"use strict";
const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(
      [
        {
          ownerId: 1,
          address: "1464 La Playa St",
          city: "San Francisco",
          state: "CA",
          country: "United States",
          lat: 37.759172,
          lng: -122.509087,
          name: "Entire Apartment",
          description:
            "Elegant and newly remodeled this 1 bedroom 1 bathroom apartment is perfectly located in one of San Francisco's most sought-after neighborhoods: Pacific Heights. ",
          price: 334.0,
        },
        {
          ownerId: 2,
          address: "3790 South Las Vegas Blvd",
          city: "Las Vegas",
          state: "NV",
          country: "United States",
          lat: 36.102086,
          lng: -115.173178,
          name: "Full House",
          description:
            "Live the life of luxury in this beautiful environment friendly Vegas home. ",
          price: 255.0,
        },
        {
          ownerId: 3,
          address: "123 Main St",
          city: "New York",
          state: "NY",
          country: "United States",
          lat: 40.722907,
          lng: -73.995914,
          name: "Luxury Downtown Loft",
          description:
            "Dream in a luxury haven in the heart of Times Square. Elevated on the 23rd floor, marvel at the breathtaking Manhattan skyline.",
          price: 324.0,
        },
        {
          ownerId: 1,
          address: "222 San Rafael Ave",
          city: "Santa Barbara",
          state: "California",
          country: "United States of America",
          lat: 20.7645358,
          lng: -150.4730327,
          name: "Dreamy small cottage in tropical garden setting",
          description:
            "Step into a dreamy world of tropical wonder, surrounded by lush gardens and serene beauty. This small cottage is the epitome of coziness and charm, providing a peaceful sanctuary to relax and rejuvenate. Hosted by Vesla, your stay will be a delightful tropical retreat.",
          price: 140.0,
        },
        {
          ownerId: 4,
          address: "246 54th St",
          city: "Miami",
          state: "FL",
          country: "United States",
          lat: 25.777747,
          lng: -80.131272,
          name: "High-Rise Condo",
          description:
            "Take a break from the fast life and rejuvenate in these adorable One Bedroom apartment suites right on Miami Beach. ",
          price: 223.0,
        },
        {
          ownerId: 4,
          address: "369 Calle Cordoba",
          city: "Mexico City",
          state: "Ciudad de Mexico",
          country: "Mexico",
          lat: 19.421879,
          lng: -99.159459,
          name: "Downtown Loft",
          description:
            "Este 3BR se encuentra en el hermoso distrito de Condesa, hogar de clases de yoga, parejas jóvenes y adolescentes de skate, es el corazón del elegante pero relajante Hipódromo.",
          price: 153.0,
        },
        {
          ownerId: 2,
          address: "159 Top St",
          city: "Paris",
          state: "Île-de-France",
          country: "France",
          lat: 48.867776,
          lng: 2.361111,
          name: "Elegant Estate",
          description:
            "Sublime appartement d'exception de 100m² en Duplex, luxueux, moderne, lumineux, situé en face du Musée du Louvre, du Jardin du Palais Royal et de la rue Saint Honoré.",
          price: 545.0,
        },
        {
          ownerId: 3,
          address: "369 Calle Cordoba",
          city: "Mexico City",
          state: "Ciudad de Mexico",
          country: "Mexico",
          lat: 19.421879,
          lng: -99.259459,
          name: "Entire Bungalow",
          description:
            "A scenic tea estate on ninety-eight acres of land in fascinating Ella, Bandarawela, Sri Lanka. The colonial era in Ceylon saw this tea estate being larger in extent.",
          price: 324.0,
        },
        {
          ownerId: 1,
          address: "753 Park St",
          city: "Las Vegas",
          state: "NV",
          country: "United States",
          lat: 36.159466,
          lng: -115.131413,
          name: "Cozy Cottage",
          description:
            "This studio apartment has a 615 sq ft indoor and oversized dryer with - oversized double beds and a double sofa bed, suitable for individuals, couples, families, and groups of up to 4 people.",
          price: 155.0,
        },
        {
          ownerId: 4,
          address: "369 Calle Durango",
          city: "Mexico City",
          state: "Ciudad de Mexico",
          country: "Mexico",
          lat: 19.521879,
          lng: -99.159459,
          name: "Downtown Apartment",
          description:
            "Este 3BR se encuentra en el hermoso distrito de Condesa, hogar de clases de yoga, parejas jóvenes y adolescentes de skate, es el corazón del elegante pero relajante Hipódromo.",
          price: 345.0,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        country: {
          [Op.in]: ["United States", "Mexico", "France"],
        },
      },
      {}
    );
  },
};
