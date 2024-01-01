'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [existingModule] = await queryInterface.sequelize.query(
      'SELECT * FROM "Organizations" WHERE name = :name',
      {
        replacements: { name: 'toi' },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (existingModule) {
      return;
    }
    // Insert organization records
    await queryInterface.bulkInsert('Organizations', [
      {
        name: 'toi',
        address: '123 Main Street',
        email: 'institutetoi@gmail.com',
        phoneNumber: '1234567890',
        domain: 'sample.org',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more organization records as needed
    ]);

    // Insert organization user records
    await queryInterface.bulkInsert('Users', [
      {
        organizationId: 1, // Replace with a valid organization ID
        firstName: 'toi',
        lastName: 'admin',
        email: 'institutetoi@gmail.com',
        oauthProvider: 'google',
        oauthId: 'google123',
        isActive: true,
        roleId: 1, // Replace with a valid role ID
        loginActivity: 'Last login: ' + new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more organization user records as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded organization records
    await queryInterface.bulkDelete('Organizations', null, {});
  },
};
