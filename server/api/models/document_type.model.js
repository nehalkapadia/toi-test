
module.exports = (sequelize, Sequelize) => {
  
    const DocumentType = sequelize.define('DocumentTypes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      isAuthDoc: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
      return DocumentType;
    };