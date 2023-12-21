'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      organizationId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Organizations',
          key: 'id',
        },
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      oauthProvider: {
        type: Sequelize.STRING,
      },
      oauthId: {
        type: Sequelize.STRING,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      loginActivity: {
        type: Sequelize.STRING,
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

    // Add createdBy and updatedBy columns to Organizations table
    await queryInterface.addColumn('Organizations', 'createdBy', {
      allowNull: true,
      type: Sequelize.INTEGER,
      defaultValue: 0
    });

    await queryInterface.addColumn('Organizations', 'updatedBy', {
      allowNull: true,
      type: Sequelize.INTEGER,
      defaultValue: 0
    });

    // Add createdBy and updatedBy columns to Organizations table
    await queryInterface.addColumn('Users', 'createdBy', {
      allowNull: true,
      type: Sequelize.INTEGER,
      defaultValue: 0
    });

    await queryInterface.addColumn('Users', 'updatedBy', {
      allowNull: true,
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
    await queryInterface.removeColumn('Organizations', 'createdBy');
    await queryInterface.removeColumn('Organizations', 'updatedBy');
  },
};
