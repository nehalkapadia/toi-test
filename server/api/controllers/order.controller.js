const orderService = require('../services/order.service');
const { successResponse, errorResponse } = require('../utils/response.util');
const constants = require('../utils/constants.util');
const eventEmitter = require("../handlers/eventEmitter");
/**
 * Controller function to create a new order.
 *
 * @param {Object} req - Express request object containing the order data in the request body.
 * @param {Object} res - Express response object to send the response.
 * @returns {Object} - JSON response with the success or error message.
 * @description Create order
 * @api /api/order
 */
exports.createOrder = async (req, res) => {
  try {
    // Extract order data from the request body
    const orderData = req.body;
    const userId = req?.userData?.id;
    if (userId) {
      orderData.createdBy = userId;
      orderData.updatedBy = userId;
    }
    // If no existing order, create a new one using the service
    const createdOrder = await orderService.createOrderInfo(orderData);

    if (createdOrder) {
      await createOrUpdateOrderDocuments(createdOrder, orderData)
    }

    // call event to send data to salesforce api
    eventEmitter.on("SubmitOrderToSalesForce", orderData);

    // Success response with the created order
    return res
      .status(constants.CREATED)
      .json(
        successResponse(constants.ORDER_CREATED_SUCCESSFULLY, { createdOrder })
      );
  } catch (error) {
    // Determine error message and send appropriate response
    const errorMessage = error.message || constants.INTERNAL_SERVER_ERROR;
    return res
      .status(constants.INTERNAL_SERVER_STATUS)
      .json(errorResponse(errorMessage));
  }
};

/**
 * Controller function to get an order by its ID.
 *
 * @param {Object} req - Express request object containing the order ID in the request parameters.
 * @param {Object} res - Express response object to send the response.
 * @returns {Object} - JSON response with the retrieved order or error message.
 * @description Get order by ID
 * @api GET /api/order/:orderId
 */
exports.getOrderById = async (req, res) => {
  try {
    // Extract order ID from the request parameters
    const orderId = req.params.orderId;

    // Get the order by ID using the service
    const order = await orderService.getOrderById(orderId);

    // Check if the order exists
    if (!order) {
      const errorMessage = constants.ORDER_NOT_FOUND;
      return res.status(constants.NOT_FOUND).json(errorResponse(errorMessage));
    }

    // Success response with the retrieved order and the custom success message
    return res
      .status(constants.SUCCESS)
      .json(successResponse(constants.ORDER_RETRIEVED_SUCCESSFULLY, order));
  } catch (error) {
    // Determine error message and send appropriate response
    const errorMessage = error.message || constants.INTERNAL_SERVER_ERROR;
    return res
      .status(constants.INTERNAL_SERVER_STATUS)
      .json(errorResponse(errorMessage));
  }
};

/**
 * Controller function to list orders with pagination and sorting.
 *
 * @param {Object} req - Express request object containing query parameters for pagination and sorting.
 * @param {Object} res - Express response object to send the response.
 * @query {number} page - Page number for pagination (default: 1).
 * @query {number} pageSize - Number of orders per page (default: 10).
 * @query {string} sortBy - Field to sort orders by (e.g., 'createdAt').
 * @query {string} sortOrder - Sorting order ('asc' or 'desc', default: 'asc').
 * @returns {Object} - JSON response with the list of orders or error message.
 * @description List orders with pagination and sorting
 * @api GET /api/orders
 */
exports.listOrders = async (req, res) => {
  try {
    // Extract query parameters for pagination and sorting
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 5;
    const sortBy = req.body.sortBy || 'createdAt';
    const sortOrder = req?.body?.ascending || false;
    const filters = req?.body?.filters ? req?.body?.filters : {};
    const userData = req?.userData;
    // Get the list of orders using the service with pagination and sorting
    const orders = await orderService.listOrders({
      page,
      pageSize,
      sortBy,
      sortOrder,
      filters,
      userData,
    });

    // Success response with the list of orders
    return res
      .status(constants.SUCCESS)
      .json(successResponse(constants.ORDERS_LISTED_SUCCESSFULLY, orders));
  } catch (error) {
    // Determine error message and send appropriate response
    const errorMessage = error.message || constants.INTERNAL_SERVER_ERROR;
    return res
      .status(constants.INTERNAL_SERVER_STATUS)
      .json(errorResponse(errorMessage));
  }
};

/**
 * Controller function to update an order.
 * @param {Object} req - Express request object containing the order data in the request body.
 * @param {Object} res - Express response object to send the response.
 * @returns {Object} - JSON response with the success or error message.
 * @description Update order
 * @api /api/order/:orderId
 * @method PUT
 */
exports.updateOrder = async (req, res) => {
  try {
    // Extract order data from the request body
    const orderData = req.body;
    const userId = req?.userData?.id;
    if (userId) {
      orderData.updatedBy = userId;
    }
    // If no existing order, create a new one using the service
    const updatedOrder = await orderService.updateOrderInfo(
      req.params.orderId,
      orderData
    );
    if (updatedOrder) {
      await createOrUpdateOrderDocuments(updatedOrder, orderData)
    }

    // Success response with the created order
    return res
      .status(constants.SUCCESS)
      .json(
        successResponse(constants.ORDER_UPDATED_SUCCESSFULLY, { updatedOrder })
      );
  } catch (error) {
    // Determine error message and send appropriate response
    const errorMessage = error.message || constants.INTERNAL_SERVER_ERROR;
    return res
      .status(constants.INTERNAL_SERVER_STATUS)
      .json(errorResponse(errorMessage));
  }
};

/**
 * Controller function to get uploaded documents for an order.
 * @param {Object} req - Express request object containing the order data in the request body.
 * @param {Object} res - Express response object to send the response.
 * @returns {Object} - JSON response with the success or error message.
 * @description Get uploaded documents for an order
 * @api /api/order/files/:orderId
 * @method GET
 */
exports.getUploadedDocuments = async (req, res) => {
  try {
    // Extract order data from the request body
    const orderId = req.params.orderId;

    const uploadedFiles = await orderService.getOrderDocuments(orderId);

    // Success response with the created order
    return res
      .status(constants.SUCCESS)
      .json(
        successResponse(constants.ORDER_UPDATED_SUCCESSFULLY, uploadedFiles)
      );
  } catch (error) {
    // Determine error message and send appropriate response
    const errorMessage = error.message || constants.INTERNAL_SERVER_ERROR;
    return res
      .status(constants.INTERNAL_SERVER_STATUS)
      .json(errorResponse(errorMessage));
  }
};

/**
 * Controller function to save an order as a draft.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Express JSON response.
 * @description To save the order data save as a draft.
 * @api /api/order/SaveAsDraft
 * @method POST
 */
exports.saveOrderAsDraft = async (req, res) => {
  try {
    // Extract order data from the request body
    const orderData = req.body;
    const userId = req?.userData?.id;
    const organizationId = req?.userData?.user?.organizationId;

    if (userId) {
      orderData.createdBy = userId;
      orderData.updatedBy = userId;
    }

    if (organizationId) {
      orderData.organizationId = organizationId;
    }
    // Save the order using the orderService
    const order = await orderService.saveOrderAsDraft(orderData);

    if (order) {
      await createOrUpdateOrderDocuments(order, orderData)
    }

    // Respond with a success message and the saved order
    return res
      .status(constants.CREATED)
      .json(successResponse(constants.ORDER_SAVED_SUCCESSFULLY, order));
  } catch (error) {
    // Determine error message and send an appropriate response
    const errorMessage = error.message || constants.INTERNAL_SERVER_ERROR;
    return res
      .status(constants.INTERNAL_SERVER_STATUS)
      .json(errorResponse(errorMessage));
  }
};

const createOrUpdateOrderDocuments = async (order, orderData) => {
  if (orderData?.uploadFiles?.length > 0) {
    await orderService.uploadFiles(order, orderData.uploadFiles);
    if (orderData?.orderAuthDocuments?.length > 0)
      await orderService.createOrderAuthDocuments(
        order,
        orderData.orderAuthDocuments
      );
  }
}
