// validators/orderValidator.js
const { body } = require('express-validator');
const constants = require('../utils/constants.util');

exports.createOrderSchema = [
  body('patientId')
    .exists().withMessage(constants.PATIENT_ID_REQUIRED)
    .isNumeric().withMessage(constants.PATIENT_ID_NUMERIC_ERROR),
  
  body('orderTypeId')
    .notEmpty().withMessage(constants.ORDER_TYPE_ID_REQUIRED)
    .isNumeric().withMessage(constants.ORDER_TYPE_ID_NUMERIC_ERROR),  

  body('historyId')
    .exists().withMessage(constants.HISTORY_ID_REQUIRED)
    .isNumeric().withMessage(constants.HISTORY_ID_NUMERIC_ERROR),

  body('recordId')
    .exists().withMessage(constants.RECORD_ID_REQUIRED)
    .isNumeric().withMessage(constants.RECORD_ID_NUMERIC_ERROR),

  body('insuranceId')
    .exists().withMessage(constants.INSURANCE_ID_REQUIRED)
    .isNumeric().withMessage(constants.INSURANCE_ID_NUMERIC_ERROR),
];
