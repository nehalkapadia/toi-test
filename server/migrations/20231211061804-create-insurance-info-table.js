'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('InsuranceInfos', {
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
      medicareId: {
        type: Sequelize.STRING,
      },
      healthPlan: {
        type: Sequelize.STRING,
      },
      ipaName: {
        type: Sequelize.STRING,
      },
      lob: {
        type: Sequelize.STRING,
      },
      primarySubscriberNumber: {
        type: Sequelize.INTEGER,
      },
      primaryGroupNumber: {
        type: Sequelize.INTEGER,
      },
      secondaryInsurance: {
        type: Sequelize.STRING,
      },
      secondarySubscriberNumber: {
        type: Sequelize.INTEGER,
      },
      secondaryGroupNumber: {
        type: Sequelize.INTEGER,
      },
      copyOfInsuranceCard: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PatDocuments',
          key: 'id',
        },
      },
      primaryStartDate: {
        type: Sequelize.DATE,
      },
      primaryEndDate: {
        type: Sequelize.DATE,
      },
      secondaryStartDate: {
        type: Sequelize.DATE,
      },
      secondaryEndDate: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('InsuranceInfos');
  },
};
