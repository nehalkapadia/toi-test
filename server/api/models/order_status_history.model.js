module.exports = (sequelize, Sequelize) => {
  const OrderStatusHistory = sequelize.define(
    'OrderStatusHistories',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Orders',
          key: 'id',
        },
      },
      extOrderStatus: {
        type: Sequelize.STRING,
      },
      intOrderStatus: {
        type: Sequelize.STRING,
      },
      comment: {
        type: Sequelize.STRING,
      },
      orderSubmissionDate: {
        type: Sequelize.DATE,
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
  return OrderStatusHistory;
};
