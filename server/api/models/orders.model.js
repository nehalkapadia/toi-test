module.exports = (sequelize, Sequelize) => {
  const PatientDemo = require('./patient_demo.model')(sequelize, Sequelize);
  const MedicalHistory = require('./medical_history.model')(sequelize, Sequelize);
  const MedicalRecord = require('./medical_records.model')(sequelize, Sequelize);
  const InsuranceInfo = require('./insurance_info.model')(sequelize, Sequelize);
  const Organization = require('./organization.model')(sequelize, Sequelize);
  const User = require('./user.model')(sequelize, Sequelize);
  const OrderPatDocument = require('./order_pat_document.model')(sequelize, Sequelize);
  const Orders = sequelize.define(
    'Order',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      caseId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      patientId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PatientDemos',
          key: 'id',
        },
      },
      historyId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'MedicalHistories',
          key: 'id',
        },
      },
      recordId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'MedicalRecords',
          key: 'id',
        },
      },
      insuranceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'InsuranceInfos',
          key: 'id',
        },
      },
      organizationId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Organizations',
          key: 'id',
        },
      },
      currentStatus: {
        type: Sequelize.STRING,
      },
      salesForceSyncUp: {
        type: Sequelize.BOOLEAN,
        default: false,
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
      isDeleted: {
        type: Sequelize.BOOLEAN,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    },
    { timestamps: true }
  );

  Orders.belongsTo(PatientDemo, { foreignKey: 'patientId', as: 'patientDemography' });
  Orders.belongsTo(MedicalHistory, { foreignKey: 'historyId', as: 'medicalHistory' });
  Orders.belongsTo(MedicalRecord, { foreignKey: 'recordId', as: 'medicalRecord' });
  Orders.belongsTo(InsuranceInfo, { foreignKey: 'insuranceId', as: 'insuranceInfo' });
  Orders.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });
  Orders.belongsTo(User, { foreignKey: 'createdBy', as: 'userData' });
  Orders.hasMany(OrderPatDocument, {
    foreignKey: 'orderId'
  })

  return Orders;
};
