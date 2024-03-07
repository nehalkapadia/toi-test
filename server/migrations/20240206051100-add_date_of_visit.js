'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('MedicalHistories', 'dateOfVisit', {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn('MedicalHistories', 'chemotherapyOrdered', {
      type: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('MedicalHistories', 'dateOfVisit');
    await queryInterface.removeColumn('MedicalHistories', 'chemotherapyOrdered');
  }
};
