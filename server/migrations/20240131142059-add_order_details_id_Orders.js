module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'orderDetailsId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'OrderDetails',
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'orderDetailsId');
  },
};