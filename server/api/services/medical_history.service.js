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