const db = require('../models');
const OrganizationLog = db.OrganizationLogs;

/**
 *
 * @params {object} organizationLogData
 * @returns
 * @description create organization logs
 * @access Private
 */
exports.createOrganizationLog = async (organizationLogData) => {
  return await OrganizationLog.create(organizationLogData);
};
