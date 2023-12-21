'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MedicalHistories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      patientId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PatientDemos',
          key: 'id',
        },
      },
      diagnosis: {
        type: Sequelize.STRING,
      },
      chemoTherapyStatus: {
        type: Sequelize.BOOLEAN,
      },
      referringProvider: {
        type: Sequelize.STRING,
      },
      isReferringPhysician: {
        type: Sequelize.BOOLEAN,
      },
      orderingProvider: {
        type: Sequelize.STRING,
      },
      pcpName: {
        type: Sequelize.STRING,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MedicalHistories');
  },
};
