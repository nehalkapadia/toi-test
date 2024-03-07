module.exports = (sequelize, Sequelize) => {
  const OrderDetails = sequelize.define(
    'OrderDetails',
    {
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
      cptCodes: {
        type: Sequelize.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue('cptCodes'));
        },
        set: function (value) {
            this.setDataValue('cptCodes', JSON.stringify(value));
        },
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      timestamps: true,
    }
  );

  return OrderDetails;
};
