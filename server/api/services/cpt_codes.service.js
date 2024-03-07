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
  let dose;
  let frequency;
  if (cptCodes.length > 0) {
    for (let cptCode of cptCodes) {
      description = typeof cptCode.description != 'undefined' ? cptCode.description : '';
      dose = typeof cptCode.dose != 'undefined' ? cptCode.dose : '';
      frequency = typeof cptCode.frequency != 'undefined' ? cptCode.frequency : '';

      caMedListC.push(description + ', ' + dose + ', ' + frequency);
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