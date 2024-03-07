const { OrderTypes } = require('../models');
const { Op } = require('sequelize');
const { OFFICE_VISIT_ORDER_TYPE, RADIATION_ORDER_TYPE, AUTH_COORDINATOR } = require('../utils/constants.util');

/**
 * Fetch the list of order types
 * @returns {Promise<Array>} A promise that resolves to an array of order types
 */
const list = async (payload) => {
  try {
    const whereClause = {}
    if(payload?.userData?.user?.role?.roleName === AUTH_COORDINATOR) {
      whereClause.name = {
        [Op.in]: [OFFICE_VISIT_ORDER_TYPE, RADIATION_ORDER_TYPE],
      };
    }
    // Fetch all order types from the database
    const orderTypes = await OrderTypes.findAll({
      where: whereClause
    });
    return orderTypes;
  } catch (error) {
    console.error('Error fetching order types:', error);
    throw error; 
  }
};

module.exports = {
  list,
};
