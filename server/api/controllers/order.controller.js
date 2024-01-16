const orderService = require('../services/order.service');
const { successResponse, errorResponse } = require('../utils/response.util');
const constants = require('../utils/constants.util');
const { createLog } = require('../services/audit_log.service');
const { formatRequest } = require('../utils/common.util');
const eventEmitter = require("../handlers/event_emitter");
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
    await createLog(formatRequest(req), 'Orders', 'POST');
    // Extract order data from the request body
    const orderData = req.body;
    const userId = req?.userData?.id;
    if (userId) {
      orderData.createdBy = userId;
      orderData.updatedBy = userId;
      orderData.ownerId = userId;
    }
    // If no existing order, create a new one using the service
    const createdOrder = await orderService.createOrderInfo(orderData);

    if (createdOrder) {
      await createOrUpdateOrderDocuments(createdOrder, orderData);
    }

    // send data to salesforce only if order is submitted
    if (createdOrder.currentStatus === 'submitted') {
      eventEmitter.emit("SubmitOrderToSalesForce", createdOrder);
    }

    // Success response with the created order
    return res
      .status(constants.CREATED)
      .json(
        successResponse(constants.ORDER_CREATED_SUCCESSFULLY, { createdOrder })
      );
  } catch (error) {
    await createLog(formatRequest(req), 'Orders', 'POST', error);
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
    const sortBy = req.body.orderBy || 'createdAt';
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
    await createLog(formatRequest(req), 'Orders', 'PUT');
    // Extract order data from the request body
    const orderData = req.body;
    const userId = req?.userData?.id;
    if (userId) {
      orderData.updatedBy = userId;
      orderData.ownerId = userId;
    }
    // If no existing order, create a new one using the service
    const updatedOrder = await orderService.updateOrderInfo(
      req.params.orderId,
      orderData
    );
    if (updatedOrder) {
      await createOrUpdateOrderDocuments(updatedOrder, orderData);
    }

    // send data to salesforce only if order is submitted
    if (updatedOrder.currentStatus === 'submitted') {
      eventEmitter.emit("SubmitOrderToSalesForce", updatedOrder);
    }

    // Success response with the created order
    return res
      .status(constants.SUCCESS)
      .json(
        successResponse(constants.ORDER_UPDATED_SUCCESSFULLY, { updatedOrder })
      );
  } catch (error) {
    await createLog(formatRequest(req), 'Orders', 'PUT', error);
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
    await createLog(formatRequest(req), 'Orders', 'DRAFT');
    // Extract order data from the request body
    const orderData = req.body;
    const userId = req?.userData?.id;
    const organizationId = req?.userData?.user?.organizationId;

    if (userId) {
      orderData.createdBy = userId;
      orderData.updatedBy = userId;
      orderData.ownerId = userId;
    }

    if (organizationId) {
      orderData.organizationId = organizationId;
    }
    // Save the order using the orderService
    const order = await orderService.saveOrderAsDraft(orderData);

    if (order) {
      await createOrUpdateOrderDocuments(order, orderData);
    }

    // Respond with a success message and the saved order
    return res
      .status(constants.CREATED)
      .json(successResponse(constants.ORDER_SAVED_SUCCESSFULLY, order));
  } catch (error) {
    await createLog(formatRequest(req), 'Orders', 'DRAFT', error);
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
  }
  if (orderData?.orderAuthDocuments?.length > 0)
    await orderService.createOrderAuthDocuments(
      order,
      orderData.orderAuthDocuments
    );
};

/**
 * Controller function to get all order documents by order ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description Get all order documents for a specific order, fetching the latest uploaded documents.
 * @api /api/orders/documents/:orderId
 * @method GET
 */
exports.getAllOrderDocuments = async (req, res) => {
  try {
    // Extract order ID from request parameters
    const orderId = req.params.orderId;

    // Find the order by ID using the OrderService
    const order = await orderService.findOneById(orderId);

    // If the order does not exist, return a bad request response
    if (!order) {
      return res
        .status(constants.BAD_REQUEST)
        .json(errorResponse(constants.ORDER_NOT_FOUND));
    }

    // Find all order authorization documents for the given order using OrderAuthDocumentsService
    const orderAuthDocuments = await orderService.findAllByOrderIdAndPatientId(
      orderId,
      order.patientId
    );

    // Extract patDocumentIds from orderAuthDocuments
    const patDocumentIdsFromAuth = orderAuthDocuments.map(
      (auth) => auth.patDocumentId
    );

    // Find all order patient documents for the given order using OrderPatDocumentsService
    const orderPatDocuments = await orderService.findAllOrderPatDocuments(
      orderId
    );

    // Extract patDocumentIds from orderPatDocuments
    const patDocumentIdsFromPat = orderPatDocuments.map(
      (pat) => pat.patDocumentId
    );

    // Concatenate the arrays of patDocumentIds
    const allPatDocumentIds = [
      ...patDocumentIdsFromAuth,
      ...patDocumentIdsFromPat,
    ];

    // Find the latest 5 patDocuments with the concatenated patDocumentIds using PatDocumentsService
    const allPatDocuments = await orderService.findLatestPatDocumentsByIds(
      allPatDocumentIds,
      5
    );

    // Return success response with the latest documents data
    return res
      .status(constants.SUCCESS)
      .json(
        successResponse(constants.ALL_ORDER_DOCUMENTS_FETCHED, allPatDocuments)
      );
  } catch (error) {
    // Handle errors and log them
    await createLog(formatRequest(req), 'Orders', 'getAllOrderDocuments', error);

    // Determine the response status based on the error or use internal server status
    const status = error.status ?? constants.INTERNAL_SERVER_STATUS;

    // Return an error response with the appropriate status and error message
    return res
      .status(status)
      .json(errorResponse(constants.INTERNAL_SERVER_ERROR, error?.message));
  }
};

/**
 * delete order by its id
 * @param {*} req
 * @param {*} res
 * @returns {Object} - JSON response with the success or error message.
 * @description delete order by its id
 * @api /api/order/:orderId
 * @method DELETE
 */
exports.deleteOrderById = async (req, res) => {
  try {
    await createLog(formatRequest(req), 'Orders', 'DELETE');
    // Extract order ID from the request parameters
    const orderId = req.params.orderId;

    // Get the order by ID using the service
    const order = await orderService.getOrderById(orderId);

    // Check if the order exists
    if (!order) {
      const errorMessage = constants.ORDER_NOT_FOUND;
      return res.status(constants.NOT_FOUND).json(errorResponse(errorMessage));
    }

    // Delete the order by ID using the service
    await orderService.deleteOrderById(orderId);

    // Success response with the retrieved order and the custom success message
    return res
      .status(constants.SUCCESS)
      .json(successResponse(constants.ORDER_DELETED_SUCCESSFULLY));
  } catch (error) {
    await createLog(formatRequest(req), 'Orders', 'DELETE', error);
    // Determine error message and send appropriate response
    const errorMessage = error.message || constants.INTERNAL_SERVER_ERROR;
    return res
      .status(constants.INTERNAL_SERVER_STATUS)
      .json(errorResponse(errorMessage));
  }
}



/**
 * Soft delete order
 * @param {*} req
 * @param {*} res
 * @returns
 * @description Soft delete order
 * @api /api/orders/soft/delete/:orderId
 * @method POST
 */
exports.softDeleteOrder = async (req, res) => {
  try {
    await createLog(formatRequest(req), 'Orders', 'SoftDelete');

    const orderId = req.params.orderId;
    const userId = req?.userData?.id;

    // Check if the order exists
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return res.status(constants.NOT_FOUND).json(errorResponse(constants.ORDER_NOT_FOUND));
    }

    // Soft delete the order
    const softDeletedOrder = await orderService.softDeleteOrder(orderId, userId);

    // Return success response
    return res.status(constants.SUCCESS).json(successResponse(constants.ORDER_DELETED_SUCCESSFULLY));
  } catch (error) {
    // Log and return internal server error response
    await createLog(formatRequest(req), 'Orders', 'SoftDelete', error);
    return res.status(constants.INTERNAL_SERVER_STATUS).json(errorResponse(constants.INTERNAL_SERVER_ERROR));
  }
};