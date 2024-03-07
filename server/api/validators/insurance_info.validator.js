const { body, query } = require('express-validator');
const constants = require('../utils/constants.util');

/* create insurance_info schema */
exports.createInsuranceSchema = [
  body('patientId').notEmpty().withMessage(constants.PATIENT_ID_REQUIRED),
  body('healthPlan').notEmpty().withMessage(constants.HEALTH_PLAN_REQUIRED),

  // Custom validation for secondaryInsurance
  body('secondaryInsurance')
    .optional()
    .custom((value, { req }) => {
      // If secondaryInsurance is true, secondaryStartDate and secondaryEndDate are mandatory
      if (value === true) {
        const secondaryStartDate = req.body.secondaryStartDate;
        const secondaryEndDate = req.body.secondaryEndDate;

        if (!secondaryStartDate || !secondaryEndDate) {
          throw new Error(constants.SECONDARY_INSURANCE_DATES_REQUIRED);
        }
      }

      return true;
    }),
];

// get insurance_info schema
exports.getInsuranceSchema = [
  query('insuranceId')
    .notEmpty()
    .withMessage(constants.CANT_BE_EMPTY + 'Insurance ID')
    .isNumeric()
    .withMessage(constants.MUST_BE_NUMBER + 'Insurance ID'),
];
