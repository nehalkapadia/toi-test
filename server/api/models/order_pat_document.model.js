module.exports = (sequelize, Sequelize) => {
  const PatDocument = require('./pat_document.model')(sequelize, Sequelize);
  const OrderPatDocument = sequelize.define(
    'OrderPatDocument',
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
      patDocumentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PatDocuments',
          key: 'id',
        },
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
  OrderPatDocument.belongsTo(PatDocument, {
    foreignKey: 'patDocumentId',
    as: 'patDocument',
  });
  return OrderPatDocument;
};
