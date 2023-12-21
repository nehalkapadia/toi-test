module.exports = (sequelize, Sequelize) => {
  const Npi = sequelize.define(
    'Npi',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      medicalHistoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'MedicalHistories',
          key: 'id',
        },
      },
      first_name: {
        type: Sequelize.STRING,
      },
      middle_name: {  // New field
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
      },
      name_prefix: {  // New field
        type: Sequelize.STRING,
      },
      credential: {  // New field
        type: Sequelize.STRING,
      },
      gender: {  // New field
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.STRING,
      },
      npiNumber: {
        type: Sequelize.STRING,
      },
      faxNumber: {
        type: Sequelize.STRING,
      },
      taxonomies: {
        type: Sequelize.STRING,
      },
      npiType: {
        type: Sequelize.STRING,
      },
      enumeration_date: {  // New field
        type: Sequelize.DATE,
      },
      last_updated: {  // New field
        type: Sequelize.DATE,
      },
      status: {  // New field
        type: Sequelize.STRING,
      },
      sole_proprietor: {  // New field
        type: Sequelize.BOOLEAN,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
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
    },
    { timestamps: true }
  );
  return Npi;
};
