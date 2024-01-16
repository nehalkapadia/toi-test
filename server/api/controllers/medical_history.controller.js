// import constants
const constantsUtil = require('../utils/constants.util');
// import response
const { errorResponse, successResponse } = require('../utils/response.util');
// Import services
const medicalHistoryService = require('../services/medical_history.service');
const patientService = require('../services/patient.service');
const auditLogService = require('../services/audit_log.service');
const { formatRequest } = require('../utils/common.util');

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 * @description Create medical history
 * @api /api/medicalHistory
 */
exports.create = async (req, res, next) => {
  try {
    await auditLogService.createLog(formatRequest(req), 'MedicalHistories', 'Create');
    const reqData = req.body;
    const id = req?.userData?.id;
    // check if patient exist
    const isPatientExist = await patientService.isPatientExist(
      reqData.patientId
    );
    if (!isPatientExist) {
      return res
        .status(constantsUtil.BAD_REQUEST)
        .json(errorResponse(constantsUtil.notFound('Patient')));
    }
    if (reqData?.historyId) {
      // if medical history is exist then update
      const isMedicalHistoryExist =
        await medicalHistoryService.updateMedicalHistory(reqData);
      if (isMedicalHistoryExist) {
        return res
          .status(constantsUtil.SUCCESS)
          .json(
            successResponse(
              constantsUtil.message('Medical History', 'Update'),
              isMedicalHistoryExist
            )
          );
      }
    }
    if (id) {
      reqData.createdBy = id;
      reqData.updatedBy = id;
    }
    // create medical history
    delete reqData?.historyId;
    delete reqData?.orderId;
    const medicalHistory = await medicalHistoryService.createMedicalHistory(
      reqData
    );
    // return response
    return res
      .status(constantsUtil.SUCCESS)
      .json(
        successResponse(
          constantsUtil.message('Medical History', 'Create'),
          medicalHistory
        )
      );
  } catch (error) {
    // error response
    await auditLogService.createLog(formatRequest(req), 'MedicalHistories', 'Create', error);
    return res
      .status(constantsUtil.INTERNAL_SERVER_STATUS)
      .json(errorResponse(constantsUtil.INTERNAL_SERVER_ERROR, error));
  }
};

/**
 * Controller function to get medical history details by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description MedicalHistory getMedicalHistoryById
 * @api /api/medicalHistory?
 * @method GET
 */
exports.getMedicalHistoryById = async (req, res) => {
  try {
    // Extract medical history ID from the request parameters
    const medicalHistoryId = req.query.historyId;

    // Get the medical history by ID using the service
    const medicalHistory = await medicalHistoryService.getMedicalHistoryById(
      medicalHistoryId
    );

    // Check if the medical history exists
    if (!medicalHistory) {
      // If medical history not found, return a not found response
      const errorMessage = constantsUtil.MEDICAL_HISTORY_NOT_FOUND;
      return res
        .status(constantsUtil.NOT_FOUND)
        .json(errorResponse(errorMessage));
    }

    // Success response with the retrieved medical history and the custom success message
    return res
      .status(constantsUtil.SUCCESS)
      .json(
        successResponse(
          constantsUtil.MEDICAL_HISTORY_RETRIEVED_SUCCESSFULLY,
          medicalHistory
        )
      );
  } catch (error) {
    // Determine error message and send an appropriate response
    const errorMessage = error.message || constantsUtil.INTERNAL_SERVER_ERROR;
    return res
      .status(constantsUtil.INTERNAL_SERVER_STATUS)
      .json(errorResponse(errorMessage));
  }
};
