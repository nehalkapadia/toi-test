// Base route path
const baseRoute = '/api';
  
module.exports = (app) => {
  app.use(`${baseRoute}/auth`, require('./auth.route'));
  app.use(`${baseRoute}/users`, require('./user.route'));
  app.use(`${baseRoute}/organizations`, require('./organization.route'));
  app.use(`${baseRoute}/patients`, require('./patient.route'));
  app.use(`${baseRoute}/npiRegistory`, require('./npi.route'));
  app.use(`${baseRoute}/medicalHistory`, require('./medical_history.route'));
  app.use(`${baseRoute}/medicalRecord`, require('./medical_record.route'));
  app.use(`${baseRoute}/insuranceInfo`, require('./insurance_info.route'));
  app.use(`${baseRoute}/fileUpload`, require('./file_upload.route'));
  app.use(`${baseRoute}/documentTypes`, require('./document_type.route'));
  app.use(`${baseRoute}/patientDocuments`, require('./patient_document.route'));
  app.use(`${baseRoute}/orderAuthDocument`, require('./order_auth_document.route'));
  app.use(`${baseRoute}/order`, require('./order.route'));
};
