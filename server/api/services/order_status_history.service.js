const db = require('../models');
const { Op } = require('sequelize');
const Order = db.Orders;
const OrderStatusHistory = db.OrderStatusHistories;
const { STATUS_MAPPING } = require('../utils/order_status_mapping.util');

const checkEntityExistence = async (id, model, modelName) => {
  if (!id) {
    return null;
  }

  const entity = await model.findByPk(id);

  if (!entity) {
    const errorMessage = `Invalid ${modelName}Id. ${modelName} not found.`;
    throw new Error(errorMessage);
  }

  return entity;
};

/**
 * 
 * @param {Object} data 
 * @returns This will return the object of insert data 
 */
const prepareInsertData = (data) => {
  return {
    orderId: data.id,
    extOrderStatus: data.externalStatus,
    intOrderStatus: data.internalStatus,
    comment: data.comment,
    orderSubmissionDate: data.updatedAt,
    createdBy: 1,
    updatedBy: 1
  }
}

/**
 * insert the order status history
 * @param {*} data 
 */
const insertOrderHistory = async (data) => {
  await OrderStatusHistory.create(data);
}

/**
 * This function will return the internal status based on external status mapping
 * @param {String} externalStatus 
 * @returns {String} internalStatus
 */
const getInternalStatusBasedOnExternalStatus = async (externalStatus) => {
  let internalStatus;

  for (let internalStatus in STATUS_MAPPING) {
    if (typeof internalStatus != 'undefined' && internalStatus != null && STATUS_MAPPING[internalStatus].includes(externalStatus)) {
      return internalStatus;
    }
  }

  return internalStatus;
}


const createOrderStatusHistory = async ({ orderId, intOrderStatus, /* Add other necessary fields */ }) => {
  try {
    await checkEntityExistence(orderId, Order, 'Order');

    const orderStatusHistoryData = {
      orderId,
      intOrderStatus,
      // Add other necessary fields for OrderStatusHistories
      createdAt: new Date(),
    };

    return OrderStatusHistory.create(orderStatusHistoryData);
  } catch (error) {
    throw error;
  }
};


module.exports = {
  insertOrderHistory,
  prepareInsertData,
  getInternalStatusBasedOnExternalStatus,
  createOrderStatusHistory
}