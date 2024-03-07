'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'toiStatus', {
      type: Sequelize.STRING,
      allowNull: true, // Adjust this based on your requirements
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'toiStatus');
  },
};
