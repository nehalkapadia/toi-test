// patientValidator.js
const { body } = require('express-validator');
const constants = require('../utils/constants.util');

// create medical record schema
exports.createMedicalRecordSchema = [
    body('patientId')
    .notEmpty().withMessage(constants.CANT_BE_EMPTY + 'Patient Id'),
];
