const dbConfig = require("../../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database: ', error);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require("./user.model.js")(sequelize, Sequelize);
db.Modules = require("./modules.model")(sequelize, Sequelize);
db.Roles = require("./roles.model")(sequelize, Sequelize);
db.Permissions = require("./permissions.model")(sequelize, Sequelize);
db.RolePermissionAccess = require("./role_permission_access.model")(sequelize, Sequelize);
db.Organizations = require("./organization.model")(sequelize, Sequelize);
db.PatientDemos = require("./patient_demo.model")(sequelize, Sequelize);
db.DocumentTypes = require("./document_type.model")(sequelize, Sequelize);
db.PatDocuments = require("./pat_document.model")(sequelize, Sequelize);
db.MedicalHistories = require("./medical_history.model")(sequelize, Sequelize);
db.MedicalRecords = require("./medical_records.model")(sequelize, Sequelize);
db.InsuranceInfos = require("./insurance_info.model")(sequelize, Sequelize);
db.Npis = require("./npi.model")(sequelize, Sequelize);
db.Orders = require("./orders.model")(sequelize, Sequelize);
db.OrderAuthDocuments = require("./order_auth_documents.model")(sequelize, Sequelize);
db.OrderStatusHistories = require("./order_status_history.model")(sequelize, Sequelize);
db.OrganizationLogs = require("./organization_log.model")(sequelize, Sequelize);
db.UserLogs = require("./user_log.model")(sequelize, Sequelize);
db.AuditLogs = require("./audit_log.model")(sequelize, Sequelize);
db.OrderPatDocuments = require("./order_pat_document.model")(sequelize, Sequelize);

module.exports = db;