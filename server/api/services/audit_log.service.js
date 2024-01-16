const db = require('../models');
const { generateUniqueId } = require('../utils/common.util');
const AuditLog = db.AuditLogs;

exports.list = async () => {
  return await AuditLog.findAll();
};

exports.detail = async (id) => {
  return await AuditLog.findByPk(id);
};

exports.createLog = async (
  req,
  tableName,
  action,
  error = null,
  partialRecordId = 0
) => {
  let uniqueId = generateUniqueId();

  // Get the current timestamp
  const timestamp = Date.now();

  // Combine nanoid and timestamp to create a unique request ID
  const requestId = `${uniqueId}${timestamp}`;
  let payload = {};
  payload.requestId = requestId;
  payload.request = req;
  payload.data = req?.body ? req?.body : req;
  payload.tableName = tableName;
  payload.action = action;
  payload.error_log = error;
  payload.tableRecordId = req?.params?.id ? req?.params?.id : partialRecordId;
  payload.isError = error ? true : false;
  return await AuditLog.create(payload);
};
