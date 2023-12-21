
module.exports = (sequelize, Sequelize) => {
  const PatDocument = require('./pat_document.model')(sequelize, Sequelize);
  const MedicalRecord = sequelize.define('MedicalRecord', {
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
  }, { timestamps: true });

  MedicalRecord.belongsTo(PatDocument, {
    foreignKey: 'radiologyStatus',
    as: 'radiologyStatusFile'
  })
  MedicalRecord.belongsTo(PatDocument, {
    foreignKey: 'pathologyStatus',
    as: 'pathologyStatusFile'
  })
  MedicalRecord.belongsTo(PatDocument, {
    foreignKey: 'labStatus',
    as: 'labStatusFile'
  })
  MedicalRecord.belongsTo(PatDocument, {
    foreignKey: 'signedMedicalReleaseForm',
    as: 'signedMedicalReleaseFormFile'
  })
  MedicalRecord.belongsTo(PatDocument, {
    foreignKey: 'uploadPreviousAuthFile',
    as: 'previousAuthFile'
  })

  return MedicalRecord;
};
