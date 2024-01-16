'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('MedicalHistories', 'diagnosisId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'DiagnosisCodes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('MedicalHistories', 'diagnosisId');
  },
};
