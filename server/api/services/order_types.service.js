const { OrderTypes } = require('../models');

/**
 * Fetch the list of order types
 * @returns {Promise<Array>} A promise that resolves to an array of order types
 */
const list = async () => {
  try {
    // Fetch all order types from the database
    const orderTypes = await OrderTypes.findAll();
    return orderTypes;
  } catch (error) {
    console.error('Error fetching order types:', error);
    throw error; 
  }
};

module.exports = {
  list,
};
