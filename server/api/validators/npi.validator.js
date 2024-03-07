// patientValidator.js
const { query, body } = require('express-validator');
const constants = require('../utils/constants.util');

exports.getNpiSchema = [
    query('npiNumber')
    .isNumeric().withMessage(constants.NPI_NUMERIC_ERROR_MESSAGE)
    .isLength({ min: 10, max: 10 }).withMessage('NPI number must be at least 10 digits'),
];

exports.createNpiSchema = [
  body('first_name')
    .notEmpty().withMessage(constants.FIRST_NAME_REQUIRED),
  body('enumeration_date')
    .notEmpty().withMessage(constants.ENUMERATION_DATE_REQUIRED)
    .isDate().withMessage(constants.ENUMERATION_DATE_INVALID),
  body('last_updated')
    .notEmpty().withMessage(constants.LAST_UPDATED_REQUIRED)
    .isDate().withMessage(constants.LAST_UPDATED_INVALID),
  body('status')
    .notEmpty().withMessage(constants.STATUS_REQUIRED),
  body('npiNumber')
      .notEmpty().withMessage(constants.NPI_NUMBER_REQUIRED)
      .isNumeric().withMessage(constants.NPI_NUMERIC_ERROR_MESSAGE),
];
  