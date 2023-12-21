// validators/orderValidator.js
const { body } = require('express-validator');
const constants = require('../utils/constants.util');

exports.createOrderSchema = [
  body('patientId')
    .exists().withMessage(constants.PATIENT_ID_REQUIRED)
    .isNumeric().withMessage(constants.PATIENT_ID_NUMERIC_ERROR),
];