// patientValidator.js
const { body, query } = require('express-validator');
const constants = require('../utils/constants.util');
const { ALPHABETIC_REGEX, DOB_REGEX } = require('../utils/pattern.util');

exports.createPatientSchema = [
  body('firstName')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' First Name')
    .matches(ALPHABETIC_REGEX)
    .withMessage(constants.INVALID_ALPHABETS + ' First Name'),

  body('lastName')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Last Name')
    .matches(ALPHABETIC_REGEX)
    .withMessage(constants.INVALID_ALPHABETS + ' Last Name'),

  body('gender')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Gender'),

  body('dob')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Date of Birth')
    .matches(DOB_REGEX)
    .withMessage(constants.INVALID_DATE_FORMAT + ' Date of Birth'),

  body('email').optional().isEmail().withMessage(constants.INVALID_EMAIL),

  body('address')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Address'),

  body('mrn')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' MRN'),
];

exports.updatePatientSchema = [
  body('firstName')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' First Name')
    .matches(ALPHABETIC_REGEX)
    .withMessage(constants.INVALID_ALPHABETS + ' First Name'),

  body('lastName')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Last Name')
    .matches(ALPHABETIC_REGEX)
    .withMessage(constants.INVALID_ALPHABETS + ' Last Name'),

  body('gender')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Gender'),

  body('dob')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Date of Birth')
    .matches(DOB_REGEX)
    .withMessage(constants.INVALID_DATE_FORMAT + ' Date of Birth'),

  body('email').optional().isEmail().withMessage(constants.INVALID_EMAIL),

  body('address')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Address'),
];

exports.searchPatientSchema = [
  query('firstName')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' First Name'),

  query('lastName')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Last Name'),

  query('gender')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Gender'),

  query('dob')
    .notEmpty().withMessage(constants.CANT_BE_EMPTY + ' Date of Birth')
    .matches(DOB_REGEX).withMessage(constants.INVALID_DATE_FORMAT + ' Date of Birth'),
  
  query('mrn')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' MRN'),
];

// get patient schema
exports.getPatientSchema = [
  query('patientId')
    .notEmpty().withMessage(constants.CANT_BE_EMPTY + 'Patient ID')
    .isNumeric().withMessage(constants.MUST_BE_NUMBER + 'Patient ID'),
];
