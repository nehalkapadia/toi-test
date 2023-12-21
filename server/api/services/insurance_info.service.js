// insurance_info.service.js
const db = require('../models');
const { PatientDemos, InsuranceInfos } = require('../models');

/**
 * Check if a patient with the given ID exists in the database.
 * @param {number} patientId - The ID of the patient to check.
 * @returns {Promise<object | null>} - Returns the patient if found, otherwise returns null.
 */
async function checkPatientExistence(patientId) {
  return await PatientDemos.findOne({ where: { id: patientId } });
}

/**
 * Check if insurance information already exists for a given patient ID.
 * @param {number} patientId - The ID of the patient to check for existing insurance information.
 * @returns {Promise<object | null>} - Returns existing insurance information if found, otherwise returns null.
 */
async function checkExistingInsurance(patientId) {
  return await InsuranceInfos.findOne({
    where: { patientId },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: db.PatDocuments,
        as: 'copyOfInsuranceCardFile',
        attributes: ['id', 'documentTypeId', 'documentURL'],
        include: [
          {
            model: db.DocumentTypes,
            as: 'documentType',
            attributes: ['id', 'name'],
          },
        ],
      },
    ]
  });
}

/**
 * Create insurance information for a patient.
 * @param {object} insuranceData - The data for creating insurance information.
 * @returns {Promise<object>} - Returns the created insurance information.
 */
async function createInsuranceInformation(insuranceData) {
  return await InsuranceInfos.create(insuranceData);
}

module.exports = {
  checkPatientExistence,
  checkExistingInsurance,
  createInsuranceInformation,
};
