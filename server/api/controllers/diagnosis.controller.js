const diagnosisService = require('../services/diagnosis.service');
const { successResponse, errorResponse } = require('../utils/response.util');
const constants = require('../utils/constants.util');


/**
 * Controller function to search for diagnoses based on a partial ICDCode match.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object to send the response.
 * @returns {Object} - JSON response with the search results or an error message.
 * @description Searches for diagnoses based on a partial ICDCode match.
 * @api GET /api/diagnosis/search?ICDCode=ABC
 */
exports.searchDiagnosis = async (req, res) => {
  try {
    // Get the partial ICDCode from the query parameters
    const partialICDCode = req.query.ICDCode;

    // Check if the partialICDCode is provided and has a length greater than 2
    if (!partialICDCode || partialICDCode.length < 3) {
      return res.status(constants.BAD_REQUEST).json(errorResponse(constants.INVALID_PARTIAL_ICD_CODE));
    }

    // Call the service to search for diagnoses
    const searchResults = await diagnosisService.searchDiagnosisByPartialICDCode(partialICDCode);

    // Check if any results are found
    if (searchResults.length === 0) {
      return res.status(constants.NOT_FOUND).json(errorResponse(constants.DIAGNOSIS_NOT_FOUND));
    }

    // Respond with the search results
    return res.status(constants.SUCCESS).json(successResponse(constants.DIAGNOSIS_SEARCH_SUCCESS, searchResults));
  } catch (error) {
    // Handle errors that occur during the search process
    const errorMessage = error.message || constants.INTERNAL_SERVER_ERROR;
    return res.status(constants.INTERNAL_SERVER_STATUS).json(errorResponse(errorMessage));
  }
};


/**
 * Controller function to import CSV data into the database.
 *
 * @param {Object} req - Express request object containing the CSV file in the request body.
 * @param {Object} res - Express response object to send the response.
 * @returns {Object} - JSON response with success or error message.
 * @api POST /api/diagnosis/upload
 */
exports.importDiagnosis = async (req, res) => {
  try {
    // Check if a CSV file is attached to the request
    if (!req.file) {
      return res.status(constants.BAD_REQUEST).json(errorResponse(constants.CSV_FILE_REQUIRED));
    }

    // Get the file path from the request
    const filePath = req.file.path;

    // Import CSV data into the database
    await diagnosisService.importCsvData(filePath);

    // Respond with success message and imported data
    return res.status(constants.SUCCESS).json(successResponse(constants.DIAGNOSIS_IMPORTED));
  } catch (error) {
    // Handle errors that occur during the import process
    const errorMessage = error.message || constants.INTERNAL_SERVER_ERROR;
    return res.status(constants.INTERNAL_SERVER_STATUS).json(errorResponse(errorMessage));
  }
};
