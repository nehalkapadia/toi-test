'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [existingModule] = await queryInterface.sequelize.query(
      'SELECT * FROM "OrderTypes" WHERE name = :name',
      {
        replacements: { name: 'Chemo' },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (existingModule) {
      return;
    }

   // Insert module records for 'Chemo Auth', 'Office Visit', and 'Rad Onc'
    await queryInterface.bulkInsert('OrderTypes', [
      {
        name: 'Chemo',
        description: 'Description for Chemo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Office Visit',
        description: 'Description for Office Visit',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Radiation',
        description: 'Description for Radiation',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded module records for 'Chemo Auth', 'Office Visit', and 'Rad Onc'
    await queryInterface.bulkDelete('OrderTypes', null, {});
  }
};
