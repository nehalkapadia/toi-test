// patientValidator.js
const { body, query } = require('express-validator');
const constants = require('../utils/constants.util');

// Function to check boolean value and validate files
const validateBooleanAndFiles = (field, fileKey) => {
    return body(field)
        .optional()
        .isBoolean().withMessage(constants.MUST_BE_BOOLEAN + field)
        .custom((value, { req }) => {
            const isStatusTrue = value === true;
            return true;
        });
};

// create medical record schema
exports.createMedicalRecordSchema = [
    body('patientId')
        .notEmpty().withMessage(constants.CANT_BE_EMPTY + 'Patient Id'),
 
    // Add validation for isRadiologyStatus
    validateBooleanAndFiles('isRadiologyStatus', 'radiology file'),

    // Add validation for isPathologyStatus
    validateBooleanAndFiles('isPathologyStatus', 'pathology file'),

    // Add validation for isLabStatus
    validateBooleanAndFiles('isLabStatus', 'lab file'),

    // Add validation for isPreviousAuthorizationStatus
    validateBooleanAndFiles('isPreviousAuthorizationStatus', 'previous authorization file'),
];



// get medical record schema
exports.getMedicalRecordSchema = [
    query('recordId')
      .notEmpty().withMessage(constants.CANT_BE_EMPTY + 'Medical Record ID')
      .isNumeric().withMessage(constants.MUST_BE_NUMBER + 'Medical Record ID'),
];