const { body, query } = require('express-validator');
const constants = require("../utils/constants.util");

/* create insurance_info schema */
exports.createInsuranceSchema = [
    body('patientId').notEmpty().withMessage(constants.PATIENT_ID_REQUIRED),
    // TODO Will remove once QA confirms
    // body('medicareId').notEmpty().withMessage(constants.MEDICARE_ID_REQUIRED).trim(),
    body('primarySubscriberNumber').notEmpty().withMessage(constants.PRIMARY_SUBSCRIBER_NUMBER_REQUIRED).trim(),
    body('primaryGroupNumber').notEmpty().withMessage(constants.PRIMARY_GROUP_NUMBER_REQUIRED).trim(),
    body('lob').notEmpty().withMessage(constants.LOB_REQUIRED).trim(),
    body('primaryStartDate').notEmpty().withMessage(constants.PRIMARY_START_DATE_REQUIRED),
    body('primaryEndDate').notEmpty().withMessage(constants.PRIMARY_END_DATE_REQUIRED),


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
    .notEmpty().withMessage(constants.CANT_BE_EMPTY + 'Insurance ID')
    .isNumeric().withMessage(constants.MUST_BE_NUMBER + 'Insurance ID'),
];