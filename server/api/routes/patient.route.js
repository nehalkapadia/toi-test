const express = require('express');
const router = express.Router();
const { validate } = require('../middlewares/validate.middleware');
const patientController = require('../controllers/patient.controller');
const { createPatientSchema, updatePatientSchema, searchPatientSchema } = require('../validators/patient.validator');
const { verifyToken } = require('../middlewares/auth.middleware');

// Define routes for patient-related operations
router.get('/search', verifyToken, validate(searchPatientSchema), patientController.searchPatient);
router.post('/', verifyToken, validate(createPatientSchema), patientController.createPatient);

// Update the route definition to include a dynamic parameter for patient ID
router.put('/:id', verifyToken, validate(updatePatientSchema), patientController.updatePatient);

module.exports = router;
