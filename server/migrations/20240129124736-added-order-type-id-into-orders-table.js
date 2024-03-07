'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'orderTypeId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'OrderTypes',
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'orderTypeId');
  },
};
