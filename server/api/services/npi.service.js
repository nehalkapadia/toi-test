// npiService.js

// Import the Npi model from the database
const db = require('../models');
const Npi = db.Npis;

/**
 * 
 * @param {*} npiNumber 
 * @returns 
 * @description Check if an Npi with the given npiNumber already exists
 */
const checkIfNpiExists = async (npiNumber) => {
  return await Npi.findOne({
    where: {
      npiNumber,
    },
  });
};

/**
 * 
 * @param {*} payload 
 * @returns 
 * @description Create an Npi
 */
const createNpi = async (payload) => {
  return await Npi.create(payload);
};

/**
 * 
 * @param {*} npiNumber 
 * @param {*} newData 
 * @returns 
 * @description Update an existing Npi by npiNumber
 */
const updateNpiByNpiNumber = async (npiNumber, newData) => {
  try {
    // Check if the Npi with the given npiNumber exists
    const existingNpi = await Npi.findOne({ where: { npiNumber } });

    if (!existingNpi) {
      throw new Error('Npi not found'); // Throw an error if Npi is not found
    }

    // Update the existing Npi with the new data
    const updatedNpi = await existingNpi.update(newData);

    return updatedNpi; // Return the updated Npi record
  } catch (error) {
    throw error; // Handle the error appropriately in your controller
  }
};

// Export the functions to be used in other modules
module.exports = {
  checkIfNpiExists,
  createNpi,
  updateNpiByNpiNumber
};
