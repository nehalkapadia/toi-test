// patientValidator.js
const { body } = require('express-validator');
const constants = require('../utils/constants.util');

// create medical history schema
exports.createMedicalHistorySchema = [
    body('patientId')
    .notEmpty().withMessage(constants.CANT_BE_EMPTY + 'patientId'),

    body('diagnosis')
    .notEmpty().withMessage(constants.CANT_BE_EMPTY + 'Diagnosis'),

    body('chemoTherapyStatus')
    .notEmpty().withMessage(constants.CANT_BE_EMPTY + 'Chemotherapy Status'),

    body('orderingProvider')
    .notEmpty().withMessage(constants.CANT_BE_EMPTY + 'Ordering Provider'),

    body('referringProvider')
    .notEmpty().withMessage(constants.CANT_BE_EMPTY + 'Referring Provider'),
];
