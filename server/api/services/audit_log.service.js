const db = require('../models');
const {generateUniqueId} = require('../utils/common.util')
const AuditLog = db.AuditLogs;

exports.list = async () => {
  return await AuditLog.findAll();
};

exports.detail = async (id) => {
  return await AuditLog.findByPk(id);
};

exports.createLog = async (req, tableName, action, error) => {
  let uniqueId = generateUniqueId();

  // Get the current timestamp
  const timestamp = Date.now();

  // Combine nanoid and timestamp to create a unique request ID
  const requestId = `${uniqueId}${timestamp}`;
  let payload = {};
  payload.requestId = requestId;
  payload.request = {params: req.params, query: req.query, body: req.body};
  payload.data = req.body;
  payload.tableName = tableName,
  payload.action = action,
  payload.error_log = error;
  payload.tableRecordId = req.params.id ? req.params.id : 0;
  payload.isError = error ? true : false;
  return await AuditLog.create(payload);
};
