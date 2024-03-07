const express = require('express');
const router = express.Router();
// import controllers
const patDocumentController = require('../controllers/pat_document.controller');
// import middlewares
const multerMiddleware = require('../middlewares/multer.middleware');
const { validate } = require('../middlewares/validate.middleware');
// import validators
const { patDocumentSchema, getPatDocumentSchema } = require('../validators/pat_document.validator');
const { verifyToken } = require('../middlewares/auth.middleware');

// upload patient document
router.post(
  '/upload',
  verifyToken,
  multerMiddleware,
  validate(patDocumentSchema),
  patDocumentController.upload
);

// Delete patient document
router.delete('/:id', verifyToken, patDocumentController.delete);

// Route to get the latest documents for a patient
router.get('/', verifyToken, validate(getPatDocumentSchema), patDocumentController.getLatestDocuments);
// upload patient document
router.get(
  '/download/:id',
  verifyToken,
  patDocumentController.download
);

module.exports = router;
