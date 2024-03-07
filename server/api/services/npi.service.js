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
    // Update the existing Npi with the new data
    await Npi.update(newData, {
      where: {
        npiNumber,
      },
    });

    // get Npi details
    const npiDetails = await Npi.findOne({ where: { npiNumber } });

    return npiDetails; // Return the updated Npi record
  } catch (error) {
    throw error; // Handle the error appropriately in your controller
  }
};

/**
 * @description This function will return the first name, last name and npi number
 * @param {int} physicianNpiNumber 
 * @returns {Object} 
 */
const getNpiDetails = async (physicianNpiNumber) => {
  try {
    const npiDetails = await checkIfNpiExists(physicianNpiNumber);

    let firstName = npiDetails?.first_name ? npiDetails.first_name : '';
    let lastName = npiDetails?.last_name ? npiDetails.last_name : '';
    let npiNumber = npiDetails?.npiNumber ? npiDetails.npiNumber : '';

    return { firstName, lastName, npiNumber };

  } catch (error) {
    throw error;
  }
}

// Export the functions to be used in other modules
module.exports = {
  checkIfNpiExists,
  createNpi,
  updateNpiByNpiNumber,
  getNpiDetails,
};
