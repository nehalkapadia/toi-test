
module.exports = (sequelize, Sequelize) => {
  const PatDocument = require('./pat_document.model')(sequelize, Sequelize);
  const OrderAuthDocument = sequelize.define('OrderAuthDocument', {
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
  }, { timestamps: true });
  OrderAuthDocument.belongsTo(PatDocument, {
    foreignKey: 'patDocumentId',
    as: 'patDocument',
  });
  return OrderAuthDocument;
};