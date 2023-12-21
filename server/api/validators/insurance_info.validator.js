const { body } = require('express-validator');
const constants = require("../utils/constants.util");

/* create insurance_info schema */
exports.createInsuranceSchema = [
    body('patientId').notEmpty().withMessage(constants.PATIENT_ID_REQUIRED),
    body('medicareId').notEmpty().withMessage(constants.MEDICARE_ID_REQUIRED).trim(),
    body('primarySubscriberNumber').notEmpty().withMessage(constants.PRIMARY_SUBSCRIBER_NUMBER_REQUIRED).trim(),
    body('primaryGroupNumber').notEmpty().withMessage(constants.PRIMARY_GROUP_NUMBER_REQUIRED).trim(),
    body('lob').notEmpty().withMessage(constants.LOB_REQUIRED).trim(),
    body('primaryStartDate').notEmpty().withMessage(constants.PRIMARY_START_DATE_REQUIRED),
    body('primaryEndDate').notEmpty().withMessage(constants.PRIMARY_END_DATE_REQUIRED),
  ];