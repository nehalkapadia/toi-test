const db = require('../models');
const MedicalHistories = db.MedicalHistories;

/**
 * 
 * @param {*} medicalHistoryData 
 * @returns 
 * @description Create medical history
 * @access Private
 */
exports.createMedicalHistory = async (medicalHistoryData) => {
  return await MedicalHistories.create(medicalHistoryData);
}

/**
 * 
 * @param {int} patientId
 * @returns
 * @description Get medical history by patient id
 * @access Private
 */
exports.getMedicalHistoryByPatientId = async (patientId) => {
  return await MedicalHistories.findOne({ where: { patientId }, order: [['createdAt', 'DESC']], });
}


/**
 * Service function to get medical history by ID
 * @param {string} historyId - Medical history ID
 * @returns {Object} - Medical history details
 */
exports.getMedicalHistoryById = async (historyId) => {
  try {
    // Use the MedicalHistory model to find medical history by ID
    const medicalHistory = await MedicalHistories.findByPk(historyId);

    // Return the medical history details
    return medicalHistory;
  } catch (error) {
    // Handle the error or throw it to be caught in the controller
    throw error;
  }
};
