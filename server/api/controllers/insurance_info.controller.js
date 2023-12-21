const { successResponse, errorResponse } = require('../utils/response.util');
const constants = require('../utils/constants.util');
const insuranceService = require('../services/insurance_info.service');
const { createLog } = require('../services/audit_log.service');


/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description Insurance_Info Create
 * @api /api/insuranceInfo
 * @method POST
 */
exports.createInsurance = async (req, res) => {
  try {
    await createLog(req, 'InsuranceInfos', 'Create');
    const reqData = req.body;
    const userId = req?.userData?.id;
    const patientId = req?.body?.patientId;

    // Check if the patient exists
    const patient = await insuranceService.checkPatientExistence(patientId);

    if (!patient) {
      return res.status(constants.NOT_FOUND).json(errorResponse(constants.PATIENT_NOT_FOUND));
    }

    if(userId) {
      reqData.createdBy = userId;
      reqData.updatedBy = userId;
    }
    // Create insurance information
    const insuranceInfo = await insuranceService.createInsuranceInformation(reqData);

    // Return success response
    return res.status(constants.CREATED).json(successResponse(constants.CREATE_INSURANCE_SUCCESS, { insuranceInfo }));
  } catch (error) {
      // Return internal server error response
    await createLog(req, 'InsuranceInfos', 'Create', error);

    // Return internal server error response
    return res.status(constants.INTERNAL_SERVER_STATUS).json(errorResponse(constants.INTERNAL_SERVER_ERROR));
  }
};