'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [existingModule] = await queryInterface.sequelize.query(
      'SELECT * FROM "DocumentTypes" WHERE name = :name',
      {
        replacements: { name: 'written orders for treatment' },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (existingModule) {
      return;
    }
    // Insert organization records
    await queryInterface.bulkInsert('DocumentTypes', [
      {
        name: 'written orders for treatment',
        createdBy: 1,
        updatedBy: 1,
        isAuthDoc: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'md notes',
        createdBy: 1,
        updatedBy: 1,
        isAuthDoc: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'most recent labs',
        createdBy: 1,
        updatedBy: 1,
        isAuthDoc: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'most recent pathology',
        createdBy: 1,
        updatedBy: 1,
        isAuthDoc: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'imaging details',
        createdBy: 1,
        updatedBy: 1,
        isAuthDoc: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'radiology status',
        createdBy: 1,
        updatedBy: 1,
        isAuthDoc: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'pathology status',
        createdBy: 1,
        updatedBy: 1,
        isAuthDoc: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'lab status',
        createdBy: 1,
        updatedBy: 1,
        isAuthDoc: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'previous authorization status',
        createdBy: 1,
        updatedBy: 1,
        isAuthDoc: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'single medical release form',
        createdBy: 1,
        updatedBy: 1,
        isAuthDoc: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'copy of insurance card',
        createdBy: 1,
        updatedBy: 1,
        isAuthDoc: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'secondary insurance',
        createdBy: 1,
        updatedBy: 1,
        isAuthDoc: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded organization records
    await queryInterface.bulkDelete('DocumentTypes', null, {});
  },
};
