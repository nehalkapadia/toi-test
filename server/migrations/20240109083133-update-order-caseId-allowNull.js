'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Orders', 'caseId', {
      type: Sequelize.STRING, // Update the data type if needed
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // If you want to revert the changes, you can set allowNull back to false
    await queryInterface.changeColumn('Orders', 'caseId', {
      type: Sequelize.STRING, // Update the data type if needed
      allowNull: false,
    });
  },
};
