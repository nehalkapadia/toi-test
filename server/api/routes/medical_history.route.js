// TODO: Import express and create a router
const express = require('express');
const router = express.Router();

// TODO: Import the validate middleware
const { validate } = require('../middlewares/validate.middleware');

// TODO: Import the npiController
const medicalHistoryController = require('../controllers/medical_history.controller');

// TODO: Import the createNpiSchema
const {
  createMedicalHistorySchema,
} = require('../validators/medical_history.validator');
const { verifyToken } = require('../middlewares/auth.middleware');

// create medical history
router.post(
  '/',
  verifyToken,
  validate(createMedicalHistorySchema),
  medicalHistoryController.create
);

module.exports = router;
