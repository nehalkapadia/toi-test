// Import packages
const express = require('express');
const router = express.Router();
// Import controllers
const fileUploadController = require('../controllers/file_upload.controller');
// Import middlewares
const multerMiddleware = require('../middlewares/multer.middleware');
const { validate } = require('../middlewares/validate.middleware');
// Import validators
const { fileUploadSchema } = require('../validators/file_upload.validator');

// file upload
router.post(
  '/upload',
  multerMiddleware,
  validate(fileUploadSchema),
  fileUploadController.fileUpload
);

module.exports = router;
