module.exports = (sequelize, Sequelize) => {
  const OrderTypes = sequelize.define(
    'OrderTypes',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: true,
    }
  );

  return OrderTypes;
};
