// Require Packages
const express = require('express');
const router = express.Router();

// Require middlewares
const { validate } = require('../middlewares/validate.middleware');

// Require validators
const { createInsuranceSchema } = require('../validators/insurance_info.validator');

// require Controllers
const insuranceController = require('../controllers/insurance_info.controller');


// insurance route
router.post('/', validate(createInsuranceSchema), insuranceController.createInsurance);

module.exports = router;
