// Import packages
const express = require('express');
const router = express.Router();
// Import controllers
const documentTypeController = require('../controllers/document_type.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// list document types
router.get(
  '/',
  verifyToken,
  documentTypeController.list
);
// create document type
router.post(
  '/',
  verifyToken,
  documentTypeController.create
);
// delete document type
router.delete(
  '/:id',
  verifyToken,
  documentTypeController.delete
);

module.exports = router;
