const db = require('../models');
const CPTCode = db.CPTCode;
const { Op } = require('sequelize');

/**
 * Service function to search for CPTCodes by a partial CPTCode.
 *
 * @param {string} partialCPTCode - Partial CPTCode to search for.
 * @returns {Promise<Array>} - A promise that resolves to an array of CPTCode objects matching the partial CPTCode.
 * @throws {Error} - If there's an error during the database operation.
 * @description Searches for CPTCodes by a partial CPTCode.
 */
exports.searchCPTCodeByPartialCPTCode = async (searchText) => {
  try {
    const searchResults = await CPTCode.findAll({
      where: {
        [Op.or]: [
          {
            CPTCode: {
              [Op.like]: `%${searchText}%`,
            },
          },
          {
            Description: {
              [Op.like]: `%${searchText}%`,
            },
          },
        ],
      },
    });

    return searchResults;
  } catch (error) {
    throw error;
  }
};

/**
 * 
 * @param {Array} cptCodes 
 * @returns {String} 
 */
exports.getCaMedListC = async (cptCodes) => {

  let caMedListC = [];
  let description;
  if (cptCodes.length > 0) {
    for (let cptCode of cptCodes) {
      if(isNaN(cptCode.cptCode)) {
        description = typeof cptCode.description != 'undefined' ? cptCode.description : '';
        caMedListC.push(description);
      }
    }
  }

  return caMedListC.join('; ');
}

/**
 * 
 * @param {Array} cptCodes 
 * @returns {String} 
 */
exports.getAllJCodes = async (cptCodes) => {

  let jCodes = [];
  if (cptCodes.length > 0) {
    for (let cptCode of cptCodes) {
      jCodes.push(cptCode.cptCode);
    }
  }

  return jCodes.join(', ');
}

/**
 * 
 * @param {JSON} cptCodes 
 * @returns 
 */
exports.getDescriptionOfNonNumericCptCode = async (cptCodes) => {
  for (const element of cptCodes) {
      if (isNaN(element.cptCode)) {
          return element.description;
      }
  }
  return null; // Return null if no non-numeric cptCode is found
}

/**
 * 
 * @param {Array} cptCodes 
 * @returns {String} 
 */
exports.getMedListDetailsC = async (cptCodes) => {

  let caMedListC = [];
  let description, frequency, cycle, dose, route;
  
  if (cptCodes.length > 0) {
    for (let cptCode of cptCodes) {
      description = typeof cptCode.description != 'undefined' ? cptCode.description : '';
      frequency = typeof cptCode.frequency != 'undefined' ? cptCode.frequency : '';
      cycle = typeof cptCode.cycle != 'undefined' ? cptCode.cycle : '';
      dose = typeof cptCode.dose != 'undefined' ? cptCode.dose : '';
      route = typeof cptCode.route != 'undefined' ? cptCode.route : '';

      caMedListC.push(description + "," + dose + "," + route + "," + frequency + "," + cycle);
    }
  }

  return caMedListC.join('; ');
}
