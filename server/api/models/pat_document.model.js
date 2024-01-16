module.exports = (sequelize, Sequelize) => {
  const DocumentType = require("./document_type.model")(sequelize, Sequelize);  
  const PatDocument = sequelize.define('PatDocuments', {
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
    documentTypeId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'DocumentTypes',
        key: 'id',
      },
    },
    documentURL: {
      type: Sequelize.STRING,
    },
    documentSize: {
      type: Sequelize.INTEGER,
    },
    documentName: {
      type: Sequelize.STRING,
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

  PatDocument.belongsTo(DocumentType, {
    foreignKey: 'documentTypeId',
    as: 'documentType',
  });
    return PatDocument;
  };