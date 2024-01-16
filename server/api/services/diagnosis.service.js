// diagnosisService.js
const csv = require('csv-parser');
const fs = require('fs');
const db = require('../models');
const Diagnosis = db.Diagnosis
const { Op } = require('sequelize');


/**
 * Service function to search for diagnoses by a partial ICDCode.
 *
 * @param {string} partialICDCode - Partial ICDCode to search for.
 * @returns {Promise<Array>} - A promise that resolves to an array of diagnosis objects matching the partial ICDCode.
 * @throws {Error} - If there's an error during the database operation.
 * @description Searches for diagnoses by a partial ICDCode.
 */
exports.searchDiagnosisByPartialICDCode = async (searchText) => {
  try {
    // Use Sequelize's `findAll` with a WHERE clause for partial matching
    const searchResults = await Diagnosis.findAll({
      where: {
        [Op.or]: [
          {
            ICDCode: {
              [Op.like]: `%${searchText}%`,
            },
          },
          {
            description: {
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
 * Service function to read CSV file and return content as JSON.
 *
 * @param {string} filePath - Path to the CSV file.
 * @returns {Promise<Array>} - Resolves to an array of JSON objects representing CSV data.
 */
exports.getFileContentAsJson = async (filePath) => {
  return new Promise((resolve, reject) => {
    const fileContent = [];
 // Read the CSV file and parse its content
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Store each row of the CSV as a JSON object
        fileContent.push(row);
      })
      .on('end', () => {
        // Resolve with the array of JSON objects when the CSV is fully processed
        resolve(fileContent);
      })
      .on('error', (error) => {
        // Reject with the error if there's an issue reading the CSV
        reject(error);
      });
  });
};

/**
 * Service function to import CSV data into the database.
 *
 * @param {string} filePath - Path to the CSV file.
 * @returns {Promise<void>} - Resolves on successful import.
 */
exports.importCsvData = async (filePath) => {
  try {
    // Read CSV file and convert to JSON
    const fileContent = await this.getFileContentAsJson(filePath);

    // Map CSV data to the fields of the Diagnosis model
    const diagnoses = fileContent.map((row) => ({
      ICDCode: row.ICDCode,
      description: row.description,
    }));

    // Using Sequelize bulkCreate to insert data in a single query for better performance
    await Diagnosis.bulkCreate(diagnoses, { validate: true });

    // Optional: Delete the CSV file after successful import
    fs.unlinkSync(filePath);
  } catch (error) {
    // Handle any errors that occur during the import process
    throw error;
  }
};
