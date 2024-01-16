
// import constants
const constantsUtil = require('../utils/constants.util');
// import response
const { errorResponse, successResponse } = require('../utils/response.util');
// Import services
const medicalRecordService = require('../services/medical_record.service');
const patientService = require('../services/patient.service');
const auditLogService = require('../services/audit_log.service');
const { formatRequest } = require('../utils/common.util');

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
    await auditLogService.createLog(formatRequest(req), 'MedicalRecords', 'Create');
    const reqData = req.body;
    const id = req?.userData?.id;
    // check if patient exist
    const isPatientExist = await patientService.isPatientExist(reqData.patientId);
    if(!isPatientExist) {
        return res
        .status(constantsUtil.BAD_REQUEST).json(errorResponse(constantsUtil.notFound('Patient')))
    }

    if (reqData?.recordId) {
      // if medical history is exist then update
      const isMedicalRecordExist =
        await medicalRecordService.updateMedicalRecord(reqData);
      if (isMedicalRecordExist) {
        return res
          .status(constantsUtil.SUCCESS)
          .json(
            successResponse(
              constantsUtil.message('Medical Record', 'Update'),
              isMedicalRecordExist
            )
          );
      }
    }

    if(id) {
        reqData.createdBy = id;
        reqData.updatedBy = id;
    }
    // create medical history
    delete reqData?.recordId;
    delete reqData?.orderId;
    const medicalRecord = await medicalRecordService.createMedicalRecord(reqData);
    // return response
    return res.status(constantsUtil.SUCCESS).json(successResponse(constantsUtil.message('Medical Record', 'Create'), medicalRecord));
  } catch (error) {

    // error response
    await auditLogService.createLog(formatRequest(req), 'MedicalRecords', 'Create', error);
    return res
      .status(constantsUtil.INTERNAL_SERVER_STATUS).json(errorResponse(constantsUtil.INTERNAL_SERVER_ERROR, error))
  }
};


/**
 * Controller function to get medical record details by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description Medical_Record getMedicalRecordById
 * @api /api/medicalRecords?
 * @method GET
 */
exports.getMedicalRecordById = async (req, res) => {
  try {
    // Extract medical record ID from the request parameters
    const medicalRecordId = req.query.recordId;

    // Get the medical record by ID using the service
    const medicalRecord = await medicalRecordService.getMedicalRecordById(medicalRecordId);

    // Check if the medical record exists
    if (!medicalRecord) {
      // If medical record not found, return a not found response
      const errorMessage = constantsUtil.MEDICAL_RECORD_NOT_FOUND;
      return res.status(constantsUtil.NOT_FOUND).json(errorResponse(errorMessage));
    }

    // Success response with the retrieved medical record and the custom success message
    return res.status(constantsUtil.SUCCESS).json(successResponse(constantsUtil.MEDICAL_RECORD_RETRIEVED_SUCCESSFULLY, medicalRecord));
  } catch (error) {
    // Determine error message and send an appropriate response
    const errorMessage = error.message || constantsUtil.INTERNAL_SERVER_ERROR;
    return res.status(constantsUtil.INTERNAL_SERVER_STATUS).json(errorResponse(errorMessage));
  }
};
