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
