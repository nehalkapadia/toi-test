'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('PatientDemos', 'mrn', {
      type: Sequelize.BIGINT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('PatientDemos', 'mrn', {
      type: Sequelize.INTEGER,
    });
  },
};
