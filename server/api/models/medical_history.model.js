
module.exports = (sequelize, Sequelize) => {
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
  }, { timestamps: true });
  
  return MedicalHistory;
};
