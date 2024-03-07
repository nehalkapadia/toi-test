'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'CPT_Code',
      {
        CPTCode: {
          type: Sequelize.STRING(10),
        },
        Description: {
          type: Sequelize.STRING,
        },
      },
      {
        freezeTableName: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CPT_Code');
  },
};