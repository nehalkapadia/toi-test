const db = require('../models');
const { Op } = require('sequelize');
const PatientDemos = db.PatientDemos;

async function searchPatient(criteria) {
  try {
    const existingPatient = await PatientDemos.findOne({
      where: criteria,
    });

    return existingPatient;
  } catch (error) {
    throw error;
  }
}

async function createPatient(patientData) {
  try {
    const newPatient = await PatientDemos.create(patientData);
    return newPatient;
  } catch (error) {
    throw error;
  }
}

async function getPatientById(patientId) {
  return await PatientDemos.findByPk(patientId);
}

async function updatePatient(patientId, updatedData) {
  try {
    // Find the patient by ID and update the data
    const patient = await PatientDemos.findByPk(patientId);
    
    if (patient) {
      await patient.update(updatedData);
      return patient;
    } else {
      // Handle the case where the patient doesn't exist
      return null;
    }
  } catch (error) {
    // Handle any errors during the database update
    throw error;
  }
}

async function checkForDataConflict(patientId, updatedData) {
  try {
    // Check if there is any other patient with the same data
    const conflictingPatient = await PatientDemos.findOne({
      where: {
        [Op.and]: [
          { id: { [Op.not]: patientId } }, // Exclude the current patient
          {
            [Op.and]: [
              { firstName: updatedData.firstName },
              { lastName: updatedData.lastName },
              { dob: updatedData.dob },
              { gender: updatedData.gender },
            ]
          }
        ]
      }
    });

    return conflictingPatient;
  } catch (error) {
    // Handle any errors during the database query
    throw error;
  }
}

const isPatientExist = async (patientId) => {
  return await PatientDemos.findOne({
      where: {
        id: patientId
      }
  });
}

module.exports = {
  searchPatient,
  createPatient,
  getPatientById,
  updatePatient,
  checkForDataConflict,
  isPatientExist
};
