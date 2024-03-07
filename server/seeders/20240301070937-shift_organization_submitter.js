'use strict';

const { ORGANIZATION_TYPE_SUBMITTER, ORGANIZATION_TYPE_REVIEWER } = require('../api/utils/constants.util');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update existing records in the Organizations table
    await queryInterface.sequelize.query(
      `UPDATE Organizations SET organizationType = '${ORGANIZATION_TYPE_SUBMITTER}' WHERE organizationType IS NULL`
    );
    await queryInterface.sequelize.query(
      `UPDATE Organizations SET organizationType = '${ORGANIZATION_TYPE_REVIEWER}' WHERE name = 'toi'`
    );
  },

  down: async (queryInterface, Sequelize) => {
  }
};
