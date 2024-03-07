'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [existingModule] = await queryInterface.sequelize.query(
      'SELECT * FROM "DocumentTypes" WHERE name = :name',
      {
        replacements: { name: 'patient auth document' },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (existingModule) {
      return;
    }
    // Insert organization records
    await queryInterface.bulkInsert('DocumentTypes', [
      {
        name: 'patient auth document',
        createdBy: 1,
        updatedBy: 1,
        isAuthDoc: true,
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
