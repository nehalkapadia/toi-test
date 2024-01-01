// patientValidator.js
const { body, query } = require('express-validator');
const constants = require('../utils/constants.util');

// create medical record schema
exports.createMedicalRecordSchema = [
    body('patientId')
    .notEmpty().withMessage(constants.CANT_BE_EMPTY + 'Patient Id'),
];

// get medical record schema
exports.getMedicalRecordSchema = [
    query('recordId')
      .notEmpty().withMessage(constants.CANT_BE_EMPTY + 'Medical Record ID')
      .isNumeric().withMessage(constants.MUST_BE_NUMBER + 'Medical Record ID'),
];