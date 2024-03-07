// patientValidator.js
const { body, query } = require('express-validator');
const constants = require('../utils/constants.util');
const { ALPHABETIC_REGEX, DOB_REGEX, EMAIL_REGEX } = require('../utils/pattern.util');

const validateMemberId = (value, { req }) => !req?.query?.hsMemberID

exports.createPatientSchema = [
  body('firstName')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' First Name')
    .matches(ALPHABETIC_REGEX)
    .withMessage(constants.FIRST_NAME_LAST_NAME_CONTAIN_ONLY_ALPHABETS),

  body('lastName')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Last Name')
    .matches(ALPHABETIC_REGEX)
    .withMessage(constants.FIRST_NAME_LAST_NAME_CONTAIN_ONLY_ALPHABETS),

  body('gender')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Gender'),

  body('dob')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Date of Birth')
    .matches(DOB_REGEX)
    .withMessage(constants.INVALID_DATE_FORMAT + ' Date of Birth'),

  body('email').optional().matches(EMAIL_REGEX).withMessage(constants.INVALID_EMAIL),

  body('address')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Address'),

  body('hsMemberID')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Hs Member ID'),
];

exports.updatePatientSchema = [
  body('firstName')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' First Name')
    .matches(ALPHABETIC_REGEX)
    .withMessage(constants.FIRST_NAME_LAST_NAME_CONTAIN_ONLY_ALPHABETS),

  body('lastName')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Last Name')
    .matches(ALPHABETIC_REGEX)
    .withMessage(constants.FIRST_NAME_LAST_NAME_CONTAIN_ONLY_ALPHABETS),

  body('gender')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Gender'),

  body('dob')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Date of Birth')
    .matches(DOB_REGEX)
    .withMessage(constants.INVALID_DATE_FORMAT + ' Date of Birth'),

  body('email').optional().matches(EMAIL_REGEX).withMessage(constants.INVALID_EMAIL),

  body('address')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Address'),
];

exports.searchPatientSchema = [
  query('firstName')
    .if(validateMemberId)
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' First Name'),

  query('lastName')
    .if(validateMemberId)
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Last Name'),

  query('gender')
    .if(validateMemberId)
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + ' Gender'),

  query('dob')
    .if(validateMemberId)
    .notEmpty().withMessage(constants.CANT_BE_EMPTY + ' Date of Birth')
    .matches(DOB_REGEX).withMessage(constants.INVALID_DATE_FORMAT + ' Date of Birth'),
  // TODO will remove after test completed
  // query('hsMemberID')
  //   .notEmpty()
  //   .withMessage(constants.CANT_BE_EMPTY + ' Hs Member ID'),
];

// get patient schema
exports.getPatientSchema = [
  query('patientId')
    .notEmpty().withMessage(constants.CANT_BE_EMPTY + 'Patient ID')
    .isNumeric().withMessage(constants.MUST_BE_NUMBER + 'Patient ID'),
];
