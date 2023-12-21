'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrganizationLogs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      recordId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Organizations',
          key: 'id',
        },
      },
      action: {
        type: Sequelize.STRING,
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
      createdBy: {
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
    await queryInterface.dropTable('OrganizationLogs');
  },
};
