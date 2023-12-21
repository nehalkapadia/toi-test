
const db = require('../models');
const UserLogs = db.UserLogs;

/**
 * 
 * @param {Object} userLogData 
 * @returns 
 * @description Create user log
 * @access Private
 */
exports.createUserLog = async (userLogData) => {
  return await UserLogs.create(userLogData);
}