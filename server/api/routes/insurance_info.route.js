// Require Packages
const express = require('express');
const router = express.Router();

// Require middlewares
const { validate } = require('../middlewares/validate.middleware');

// Require authentication middleware
const { verifyToken } = require('../middlewares/auth.middleware');

// Require validators
const { createInsuranceSchema, getInsuranceSchema } = require('../validators/insurance_info.validator');

// Require Controllers
const insuranceController = require('../controllers/insurance_info.controller');

// Route to create a new insurance
router.post('/', verifyToken, validate(createInsuranceSchema), insuranceController.createInsurance);

// Route to get insurance by ID
router.get('/', verifyToken, validate(getInsuranceSchema), insuranceController.getInsuranceById);


module.exports = router;
