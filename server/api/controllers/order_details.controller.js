const constants = require('../utils/constants.util');
const { errorResponse, successResponse } = require('../utils/response.util');
const orderDetailsService = require('../services/order_details.service');
const patientService = require('../services/patient.service');

/**
 * @function createOrderDetails
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 * @description Create Order Details
 * @route POST /api/orderDetails/create
 * @method POST
 */
exports.createOrderDetails = async (req, res) => {
  try {
    const orderDetailsData = req.body;
    const id = req?.userData?.id;

    // check if patient exist
    const isPatientExist = await patientService.isPatientExist(
      orderDetailsData.patientId
    );
    if (!isPatientExist) {
      return res
        .status(constants.BAD_REQUEST)
        .json(errorResponse(constants.notFound('Patient')));
    }

    if (orderDetailsData?.orderDetailsId) {
      // if order details is exist then update
      const isOrderDetailsExist =
        await orderDetailsService.updateOrderDetails(orderDetailsData);
      if (isOrderDetailsExist) {
        return res
          .status(constants.SUCCESS)
          .json(
            successResponse(
              constants.message('Order Details', 'Updated'),
              isOrderDetailsExist
            )
          );
      }
    }
    if (id) {
      orderDetailsData.createdBy = id;
      orderDetailsData.updatedBy = id;
    }
    // create medical history
    delete orderDetailsData?.orderDetailsId;
    delete orderDetailsData?.orderId;

    // Call the service method to create order details
    const createdOrderDetails = await orderDetailsService.addOrderDetails(
      orderDetailsData
    );

    // Return the list as JSON response
    return res
      .status(constants.SUCCESS)
      .json(
        successResponse(constants.message('Order Details', 'Created'), createdOrderDetails)
      );
  } catch (error) {
    const status = error.status ?? constants.INTERNAL_SERVER_STATUS;
    // Return the error response as JSON
    return res
      .status(status)
      .json(errorResponse(constants.INTERNAL_SERVER_ERROR));
  }
};
