const db = require('../models');
const { Op } = require('sequelize');
const PatientDemos = db.PatientDemos;

async function searchPatient(criteria) {
  try {
    let whereClause = {};
    if(criteria?.mrn) {
      whereClause = {
        [Op.or]: [
          {
            [Op.and]: [
              { firstName: criteria.firstName },
              { lastName: criteria.lastName },
              { dob: criteria.dob },
              { gender: criteria.gender },
            ],
          },
          { mrn: criteria.mrn },
        ],
      };
    } else {
      whereClause = {
        [Op.and]: [
          { firstName: criteria.firstName },
          { lastName: criteria.lastName },
          { dob: criteria.dob },
          { gender: criteria.gender },
        ],
      }
    }
    const existingPatient = await PatientDemos.findOne({
      where: whereClause,
      order: [['createdAt', 'DESC']],
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

const searchOrUpdatePatient = async (payload) => {
  if(payload?.patientId) {
    const whereClause = {
      patientId: payload?.patientId
    }
    if(payload?.orderId) {
      whereClause.id = { [Op.ne]: payload?.orderId }
    }
    const order = await db.Orders.findOne({
      where: whereClause
    });
    if(order) {
      return null;
    }
    const patient = await PatientDemos.findByPk(payload?.patientId);
    if(patient) {
      delete payload?.patientId;
      delete payload?.orderId;
      await patient.update(payload);
      return patient;
    } else {
      return null;
    }
  } else {
    const patient = await PatientDemos.findOne({
      where: {
        firstName: payload?.firstName,
        lastName: payload?.lastName,
        dob: payload?.dob,
        gender: payload?.gender,
        mrn: payload?.mrn
      }
    })
    if(patient) {
      return patient;
    } else {
      return null;
    }
  }
}

module.exports = {
  searchPatient,
  createPatient,
  getPatientById,
  updatePatient,
  checkForDataConflict,
  isPatientExist,
  searchOrUpdatePatient
};
