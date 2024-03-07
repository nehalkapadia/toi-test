'use strict';

const constant = require("../api/utils/constants.util");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'salesForceSyncUpStatus', {
      type: Sequelize.STRING,
      default: constant.PENDING_STATUS,
    })

    await queryInterface.addColumn('Orders', 'retry', {
      type: Sequelize.INTEGER,
      default: 0,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'salesForceSyncUpStatus');
    await queryInterface.removeColumn('Orders', 'retry');
  }
};
