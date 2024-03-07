module.exports = (sequelize, Sequelize) => {
  const PatientDemo = require('./patient_demo.model')(sequelize, Sequelize);
  const MedicalHistory = require('./medical_history.model')(sequelize, Sequelize);
  const MedicalRecord = require('./medical_records.model')(sequelize, Sequelize);
  const InsuranceInfo = require('./insurance_info.model')(sequelize, Sequelize);
  const Organization = require('./organization.model')(sequelize, Sequelize);
  const User = require('./user.model')(sequelize, Sequelize);
  const OrderPatDocument = require('./order_pat_document.model')(sequelize, Sequelize);
  const OrderType = require('./order_types.model')(sequelize, Sequelize);
  const OrderDetails = require('./order_details.model')(sequelize, Sequelize);
  const OrderStatusHistory = require('./order_status_history.model')(sequelize, Sequelize);
  const constantsUtil = require("../utils/constants.util");

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
      orderTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'OrderTypes',
          key: 'id',
        },
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
      orderDetailsId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'OrderDetails',
          key: 'id',
        },
      },
      currentStatus: {
        type: Sequelize.STRING,
      },
      ownerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      salesForceSyncUpStatus: {
        type: Sequelize.STRING,
        default: constantsUtil.PENDING_STATUS,
      },
      retry: {
        type: Sequelize.INTEGER,
        default: 0,
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
        defaultValue: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      toiStatus: {
        type: Sequelize.STRING,
      },
    },
    { timestamps: false }
  );

  Orders.belongsTo(PatientDemo, { foreignKey: 'patientId', as: 'patientDemography' });
  Orders.belongsTo(MedicalHistory, { foreignKey: 'historyId', as: 'medicalHistory' });
  Orders.belongsTo(MedicalRecord, { foreignKey: 'recordId', as: 'medicalRecord' });
  Orders.belongsTo(InsuranceInfo, { foreignKey: 'insuranceId', as: 'insuranceInfo' });
  Orders.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });
  Orders.belongsTo(OrderDetails, { foreignKey: 'orderDetailsId', as: 'orderDetails' });
  Orders.belongsTo(User, { foreignKey: 'createdBy', as: 'userData' });
  Orders.hasMany(OrderPatDocument, {
    foreignKey: 'orderId'
  })
  Orders.belongsTo(User, { foreignKey: 'ownerId', as: 'ownerData' });
  Orders.belongsTo(OrderType, { foreignKey: 'orderTypeId', as: 'orderTypeData' });
  Orders.hasMany(OrderStatusHistory, { foreignKey: 'orderId', as: 'orderStatusHistoryData' });
  return Orders;
};
