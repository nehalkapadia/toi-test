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


/**
 * Controller function to get insurance details by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description Insurance_Info getInsuranceById
 * @api /api/insuranceInfo?
 * @method GET
 */
exports.getInsuranceById = async (req, res) => {
  try {
    // Extract insurance ID from the request parameters
    const insuranceId = req.query.insuranceId;

    // Get the insurance by ID using the service
    const insurance = await insuranceService.getInsuranceById(insuranceId);

    // Check if the insurance exists
    if (!insurance) {
      // If insurance not found, return a not found response
      const errorMessage = constants.INSURANCE_NOT_FOUND;
      return res.status(constants.NOT_FOUND).json(errorResponse(errorMessage));
    }

    // Success response with the retrieved insurance and the custom success message
    return res.status(constants.SUCCESS).json(successResponse(constants.INSURANCE_RETRIEVED_SUCCESSFULLY, insurance));
  } catch (error) {
    // Determine error message and send an appropriate response
    const errorMessage = error.message || constants.INTERNAL_SERVER_ERROR;
    return res.status(constants.INTERNAL_SERVER_STATUS).json(errorResponse(errorMessage));
  }
};