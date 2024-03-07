'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('HS_Eligibility', 'id', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    });

    await queryInterface.addColumn('HS_Eligibility', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('HS_Eligibility', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('HS_Eligibility', 'id');
    await queryInterface.removeColumn('HS_Eligibility', 'createdAt');
    await queryInterface.removeColumn('HS_Eligibility', 'updatedAt');
  }
};
