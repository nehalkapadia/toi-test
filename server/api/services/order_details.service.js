const { Op } = require('sequelize');
const db = require('../models');
const OrderDetails = db.OrderDetails;

/**
 * @function addOrderDetails
 * @param {Object} orderDetailsData - Data for creating an OrderDetails instance
 * @returns {Promise} - Promise that resolves to the created OrderDetails instance
 * @description Adds new OrderDetails to the database
 */
async function addOrderDetails(orderDetailsData) {
  return await OrderDetails.create(orderDetailsData);
}

/**
 * Service function to update Order Details
 *
 * @param {object} payload
 * @returns {object} - Updated order details
 */
async function updateOrderDetails(payload) {
  if (payload?.orderDetailsId) {
    const whereClause = {
      orderDetailsId: payload.orderDetailsId,
    };
    if (payload?.orderId) {
      whereClause.id = { [Op.ne]: payload?.orderId };
    }
    const order = await db.Orders.findOne({ where: whereClause });

    if (order) {
      return null;
    }
    const orderDetails = await OrderDetails.findByPk(payload?.orderDetailsId);

    if (orderDetails) {
      delete payload?.orderDetailsId;
      delete payload?.orderId;
      await orderDetails.update(payload);
      return orderDetails;
    } else {
      return null;
    }
  }
}

/**
 *
 * @param {int} patientId
 * @returns
 * @description Get order details by patient id
 * @access Private
 */
async function getExistingOrderDetailsByPatientId(patientId) {
  return await OrderDetails.findOne({
    where: { patientId },
    order: [['updatedAt', 'DESC']],
  });
}

module.exports = {
  addOrderDetails,
  updateOrderDetails,
  getExistingOrderDetailsByPatientId,
};
