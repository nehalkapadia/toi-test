'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AuditLogs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      requestId: {
        type: Sequelize.STRING,
      },
      request: {
        type: Sequelize.TEXT,
      },
      data: {
        type: Sequelize.TEXT,
      },
      tableName: {
        type: Sequelize.STRING,
      },
      tableRecordId: {
        type: Sequelize.STRING,
      },
      action: {
        type: Sequelize.STRING,
      },
      error_log: {
        type: Sequelize.TEXT,
      },
      isError: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('AuditLogs');
  },
};
