const { body } = require('express-validator');
const constants = require('../utils/constants.util');


exports.createOrderDetailsSchema = [
  body('cptCodes')
    .notEmpty().withMessage(constants.CANT_BE_EMPTY + 'CPT Codes'),
];