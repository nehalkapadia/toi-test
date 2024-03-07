const { successResponse, errorResponse } = require('../utils/response.util');
const constants = require('../utils/constants.util');
const orderTypeService = require('../services/order_types.service');

/**
 * List of order types
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description List of order types
 * @access Private
 * @api /api/orderTypes
 * @method GET
 */
exports.listOrderTypes = async (req, res) => {
  try {   
    // Fetch the list of order types
    const orderTypeList = await orderTypeService.list();

    // Return the list as JSON response
    return res.status(constants.SUCCESS).json(successResponse(constants.message('Order Type', 'List fetched'), orderTypeList));
  } catch (error) {  
    const status = error.status ?? constants.INTERNAL_SERVER_STATUS;
    // Return the error response as JSON
    return res.status(status).json(errorResponse(constants.INTERNAL_SERVER_ERROR));
  }
};