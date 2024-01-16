const { Op } = require('sequelize');
const db = require('../models');
const MedicalRecords = db.MedicalRecords;

/**
 *
 * @param {*} medicalRecordData
 * @returns
 * @description Create medical record
 * @access Private
 */
exports.createMedicalRecord = async (medicalRecordData) => {
  return await MedicalRecords.create(medicalRecordData);
};

/**
 *
 * @param {int} patientId
 * @returns
 * @description Get medical record by patient id
 * @access Private
 */
exports.getMedicalRecordByPatientId = async (patientId) => {
  // create an array of document types
  const docTypeArray = ['radiologyStatusFile', 'pathologyStatusFile', 'labStatusFile', 'signedMedicalReleaseFormFile', 'previousAuthFile']
  // create an array of objects to be used in the include statement
  const relationDB = []
  // loop through the array of document types and create an object for each
  for(const docType of docTypeArray){
    relationDB.push({
      model: db.PatDocuments,
      as: docType,
      attributes: ['id', 'documentTypeId', 'documentURL'],
      include: [
        {
          model: db.DocumentTypes,
          as: 'documentType',
          attributes: ['id', 'name'],
        },
      ],
    })
  }
  return await MedicalRecords.findOne({ where: { patientId },
    order: [['createdAt', 'DESC']],
    include: relationDB });
};


/**
 * Get a medical record by its ID.
 * @param {number} medicalRecordId - The ID of the medical record to retrieve.
 * @returns {Promise<Object|null>} - A promise that resolves to the retrieved medical record or null if not found.
 * @throws {Error} - Throws an error if there's an issue fetching the medical record.
 *
 * @description
 * This function asynchronously fetches a medical record from the database based on its unique ID.
 * If the medical record is found, it is returned; otherwise, null is returned.
 */
exports.getMedicalRecordById = async (medicalRecordId) => {
  try {
    const medicalRecord = await MedicalRecords.findByPk(medicalRecordId);
    return medicalRecord;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a medical record.
 * @param {object} payload - The data to use for updating the medical record.
 * 
*/
exports.updateMedicalRecord = async (payload) => {
  if(payload?.recordId) {
    const whereClause = {
      recordId: payload.recordId,
    };
    if(payload?.orderId) {
      whereClause.id = { [Op.ne]: payload?.orderId };
    }
    const order = await db.Orders.findOne({ where: whereClause });

    if(order) {
      return null;
    }
    const medicalRecord = await MedicalRecords.findByPk(payload?.recordId);

    if(medicalRecord) {
      delete payload?.recordId;
      delete payload?.orderId;
      await medicalRecord.update(payload);
      return medicalRecord;
    } else {
      return null;
    }
  }
}