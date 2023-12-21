'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MedicalRecords', {
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
      isRadiologyStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      radiologyStatus: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PatDocuments',
          key: 'id',
        },
      },
      radiologyFacility: {
        type: Sequelize.STRING,
      },
      isPathologyStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      pathologyStatus: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PatDocuments',
          key: 'id',
        },
      },
      pathologyFacility: {
        type: Sequelize.STRING,
      },
      isLabStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      labStatus: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PatDocuments',
          key: 'id',
        },
      },
      labFacility: {
        type: Sequelize.STRING,
      },
      signedMedicalReleaseForm: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PatDocuments',
          key: 'id',
        },
      },
      uploadPreviousAuthFile: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PatDocuments',
          key: 'id',
        },
      },
      isPreviousAuthorizationStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
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
    await queryInterface.dropTable('MedicalRecords');
  },
};
