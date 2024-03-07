'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('CPT_Code', 'id', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    });

    await queryInterface.addColumn('CPT_Code', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('CPT_Code', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('CPT_Code', 'id');
    await queryInterface.removeColumn('CPT_Code', 'createdAt');
    await queryInterface.removeColumn('CPT_Code', 'updatedAt');
  }
};
