const cptCodeService = require('../services/cpt_codes.service');
const { successResponse, errorResponse } = require('../utils/response.util');
const constants = require('../utils/constants.util');

/**
 * Controller function to search for CPTCodes based on a partial CPTCode match.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object to send the response.
 * @returns {Object} - JSON response with the search results or an error message.
 * @description Searches for CPTCodes based on a partial CPTCode match.
 * @api GET /api/cptCode/search?CPTCode=123
 */
exports.searchCPTCode = async (req, res) => {
  try {
    // Get the partial CPTCode from the query parameters
    const partialCPTCode = req.query.CPTCode;

    // Check if the partialCPTCode is provided and has a length greater than 2
    if (!partialCPTCode || partialCPTCode.length < 3) {
      return res.status(constants.BAD_REQUEST).json(errorResponse(constants.INVALID_PARTIAL_CPT_CODE));
    }

    // Call the service to search for CPTCodes
    const searchResults = await cptCodeService.searchCPTCodeByPartialCPTCode(partialCPTCode);

    // Check if any results are found
    if (searchResults.length === 0) {
      return res.status(constants.NOT_FOUND).json(errorResponse(constants.CPT_CODE_NOT_FOUND));
    }

    // Respond with the search results
    return res.status(constants.SUCCESS).json(successResponse(constants.CPT_CODE_SEARCH_SUCCESS, searchResults));
  } catch (error) {
    // Handle errors that occur during the search process
    const errorMessage = error.message || constants.INTERNAL_SERVER_ERROR;
    return res.status(constants.INTERNAL_SERVER_STATUS).json(errorResponse(errorMessage));
  }
};
