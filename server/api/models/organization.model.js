
module.exports = (sequelize, Sequelize) => {
  const Organization = sequelize.define(
    'Organization',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [1, 100], // Set the maximum length to 100 characters
        },
        collate: 'SQL_Latin1_General_CP1_CI_AS', // Set the collation for case-insensitive search
      },
      address: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        collate: 'SQL_Latin1_General_CP1_CI_AS', // Set the collation for case-insensitive search
      },
      phoneNumber: {
        type: Sequelize.STRING,
        collate: 'SQL_Latin1_General_CP1_CI_AS', // Set the collation for case-insensitive search
      },
      domain: {
        type: Sequelize.STRING,
        collate: 'SQL_Latin1_General_CP1_CI_AS', // Set the collation for case-insensitive search
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      organizationType: {
        type: Sequelize.STRING,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      updatedBy: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    },
    { timestamps: true }
  );

  return Organization;
};
