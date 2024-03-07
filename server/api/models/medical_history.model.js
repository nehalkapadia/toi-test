
module.exports = (sequelize, Sequelize) => {
  const NPI = require('./npi.model')(sequelize, Sequelize);
  const MedicalHistory = sequelize.define('MedicalHistory', {
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
    diagnosisId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'DiagnosisCodes',
        key: 'id',
      },
    },
    chemoTherapyStatus: {
      type: Sequelize.BOOLEAN,
    },
    orderingProvider: {
      type: Sequelize.STRING,
    },
    referringProvider: {
      type: Sequelize.STRING,
    },
    isReferringPhysician: {
      type: Sequelize.BOOLEAN,
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
    dateOfVisit: {
      type: Sequelize.DATE,
    },
    chemotherapyOrdered: {
      type: Sequelize.DATE,
    },
  }, { timestamps: true });

  MedicalHistory.belongsTo(NPI, { foreignKey: 'orderingProvider', targetKey: 'npiNumber', as: 'orderingProviderData' });
  MedicalHistory.belongsTo(NPI, { foreignKey: 'referringProvider', targetKey: 'npiNumber', as: 'referringProviderData' });
  MedicalHistory.belongsTo(NPI, { foreignKey: 'pcpName', targetKey: 'npiNumber', as: 'pcpNameData' });
  
  return MedicalHistory;
};
