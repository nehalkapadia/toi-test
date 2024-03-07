
module.exports = (sequelize, Sequelize) => {
  const PatientDemo = sequelize.define('PatientDemo', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hsMemberID: {
      type: Sequelize.STRING,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    dob: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    race: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    primaryPhoneNumber: {
      type: Sequelize.STRING,
    },
    secondaryPhoneNumber: {
      type: Sequelize.STRING,
    },
    preferredLanguage: {
          type: Sequelize.STRING,
    },
    mrn: {
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

  return PatientDemo;
};

