// patientValidator.js
const { body } = require('express-validator');
const constants = require('../utils/constants.util');

exports.createNpiSchema = [
    body('patient')
    .notEmpty().withMessage(constants.CANT_BE_EMPTY + 'Patient ID'),
];
