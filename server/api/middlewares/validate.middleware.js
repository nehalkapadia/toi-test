// Import Packages
const { validationResult } = require('express-validator');
const constants = require('../utils/constants.util');

// index.js
exports.validate = (validations) => {
  return async (req, res, next) => {
    // eslint-disable-next-line no-undef
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(constants.BAD_REQUEST).json({
      status: false,
      errors: errors.array(),
    });
  };
};
