'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Organizations', {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Organizations');
  },
};
