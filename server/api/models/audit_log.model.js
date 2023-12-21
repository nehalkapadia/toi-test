const {DataTypes} = require('sequelize')

module.exports = (sequelize, Sequelize) => {
    const AuditLogs = sequelize.define('AuditLogs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      requestId: {
        type: Sequelize.STRING,
      },
      request: {
        type: DataTypes.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue('request'));
        },
        set: function (value) {
            this.setDataValue('request', JSON.stringify(value));
        },
      },
      data: {
        type: DataTypes.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue('data'));
        },
        set: function (value) {
            this.setDataValue('data', JSON.stringify(value));
        },
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
        type: DataTypes.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue('error_log'));
        },
        set: function (value) {
            this.setDataValue('error_log', JSON.stringify(value));
        },
      },
      isError: {
        type: DataTypes.BOOLEAN,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    }, { timestamps: true });
      return AuditLogs;
    };