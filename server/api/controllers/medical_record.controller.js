
// import constants
const constantsUtil = require('../utils/constants.util');
// import response
const { errorResponse, successResponse } = require('../utils/response.util');
// Import services
const medicalRecordService = require('../services/medical_record.service');
const patientService = require('../services/patient.service');
const auditLogService = require('../services/audit_log.service');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 * @description Create medical record
 * @api /api/medicalRecords
 */
exports.create = async (req, res, next) => {
  try {
    await auditLogService.createLog(req, 'MedicalRecords', 'Create');
    const reqData = req.body;
    const id = req?.userData?.id;
    // check if patient exist
    const isPatientExist = await patientService.isPatientExist(reqData.patientId);
    if(!isPatientExist) {
        return res
        .status(constantsUtil.BAD_REQUEST).json(errorResponse(constantsUtil.notFound('Patient')))
    }
    if(id) {
        reqData.createdBy = id;
        reqData.updatedBy = id;
    }
    // create medical history
    const medicalRecord = await medicalRecordService.createMedicalRecord(reqData);
    // return response
    return res.status(constantsUtil.SUCCESS).json(successResponse(constantsUtil.message('Medical Record', 'Create'), medicalRecord));
  } catch (error) {

    // error response
    await auditLogService.createLog(req, 'MedicalRecords', 'Create', error);
    return res
      .status(constantsUtil.INTERNAL_SERVER_STATUS).json(errorResponse(constantsUtil.INTERNAL_SERVER_ERROR, error))
  }
};
