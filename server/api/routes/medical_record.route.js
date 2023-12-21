// TODO: Import express and create a router
const express = require('express');
const router = express.Router();

// TODO: Import the validate middleware
const { validate } = require('../middlewares/validate.middleware');

// TODO: Import the npiController
const medicalRecordController = require('../controllers/medical_record.controller');

// TODO: Import the createNpiSchema
const {
  createMedicalRecordSchema,
} = require('../validators/medical_record.validator');
const { verifyToken } = require('../middlewares/auth.middleware');

// create medical record
router.post(
  '/',
  verifyToken,
  validate(createMedicalRecordSchema),
  medicalRecordController.create
);

module.exports = router;
