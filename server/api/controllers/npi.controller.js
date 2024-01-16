const axios = require('axios');
const constants = require('../utils/constants.util');
const npiService = require('../services/npi.service');
const { successResponse, errorResponse } = require('../utils/response.util');
const { createLog } = require('../services/audit_log.service');
const { formatRequest } = require('../utils/common.util');

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description Npi registry
 * @api /api/npiRegistory
 * @method GET
 */
exports.validate = async (req, res) => {
  const { npiNumber } = req.query; // Extract NPI number from the request query parameters

  // Fetch medical history from the external API
  try {
    await createLog(formatRequest(req), 'Npis', 'Validate')
    const versionParam = process.env.NPI_VERSION;
    const apiUrl = `${process.env.NPI_API_ENDPOINT}/?version=${versionParam}&number=${npiNumber}`;

    // Make an HTTP GET request to the external API
    const response = await axios.get(apiUrl);

    // Check the response data for results or errors
    if (response.data && response.data.result_count > 0) {
      // If results are present, extract basic information and send a success response
      const basicInfo = response.data.results[0].basic;
      return res.status(constants.SUCCESS).json(successResponse(constants.NPI_DETAIL, basicInfo));
    } else if (response.data && response.data.Errors) {
      // If errors are present in the response, send a bad request with error details
      return res.status(constants.BAD_REQUEST).json(errorResponse(response.data.Errors));
    } else {
      // If no results or errors are found, send a bad request with a predefined error message
      return res.status(constants.BAD_REQUEST).json(errorResponse(constants.NO_NPI_FOUND));
    }
  } catch (error) {
    // Handle errors that occur during the API request and log the error message
    await createLog(formatRequest(req), 'Npis', 'Validate', error)
    return res.status(constants.INTERNAL_SERVER_STATUS).json(errorResponse(constants.INTERNAL_SERVER_ERROR));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description Npi registry create
 * @api /api/npiRegistory
 * @method POST
 */
exports.createNpi = async (req, res) => {
  try {
    await createLog(formatRequest(req), 'Npis', 'CREATE')
    // Extract relevant data from the request
    const reqData = req.body;
    const { npiNumber } = reqData;

    // Check if an Npi with the given npiNumber already exists
    const existingNpi = await npiService.checkIfNpiExists(npiNumber);

    if (existingNpi) {
      // Update the existing Npi with the new data
      const updatedNpi = await npiService.updateNpiByNpiNumber(npiNumber, reqData);
      return res.status(constants.CREATED).json(successResponse(constants.NPI_ALREADY_EXISTS, updatedNpi));
    }

    // Create Npi if it doesn't exist
    const npi = await npiService.createNpi(reqData);

    // Respond with a success message and the created Npi
    res.status(constants.CREATED).json(successResponse(constants.NPI_CREATED, npi));
  } catch (error) {
    await createLog(formatRequest(req), 'Npis', 'CREATE', error)
    // Handle errors and respond with an internal server error message
    res.status(constants.INTERNAL_SERVER_STATUS).json(errorResponse(constants.INTERNAL_SERVER_ERROR));
  }
};
