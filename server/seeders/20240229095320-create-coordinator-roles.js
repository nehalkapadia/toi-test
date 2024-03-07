'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [existingModule] = await queryInterface.sequelize.query(
      'SELECT * FROM "Roles" WHERE roleName = :roleName',
      {
        replacements: { roleName: 'Auth Co-Ordinator' },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (existingModule) {
      return;
    }
    // Insert role records
    await queryInterface.bulkInsert('Roles', [
      {
        roleName: 'Auth Co-Ordinator',
        description: 'Auth Co-Ordinator Role with limited access',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleName: 'Ordering Provider',
        description: 'Ordering Provider role with limited access',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
