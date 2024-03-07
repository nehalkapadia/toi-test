// patientValidator.js
const { body, query } = require('express-validator');
const constants = require('../utils/constants.util');

const validateOrderType = (value, { req }) =>
  req.body.orderType.toLowerCase() === 'chemo';

// create medical history schema
exports.createMedicalHistorySchema = [
  body('patientId')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' patientId'),

  body('diagnosis')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Diagnosis'),

  body('orderType')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Order Type'),

  body('chemoTherapyStatus')
    .if(validateOrderType)
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Chemotherapy Status'),

  body('orderingProvider')
    .if(validateOrderType)
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Ordering Provider'),
];

// get medical history schema
exports.getMedicalHistorySchema = [
  query('historyId')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + 'Medical History ID')
    .isNumeric()
    .withMessage(constants.MUST_BE_NUMBER + 'Medical History ID'),
];
