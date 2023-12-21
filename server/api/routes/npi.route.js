
const express = require('express');
const router = express.Router();
const { validate } = require('../middlewares/validate.middleware');
const npiController = require('../controllers/npi.controller');
const { getNpiSchema, createNpiSchema } = require('../validators/npi.validator');
const { verifyToken } = require('../middlewares/auth.middleware');

// validate npi number
router.get('/validate', verifyToken, validate(getNpiSchema), npiController.validate);
router.post('/', validate(createNpiSchema), npiController.createNpi)

module.exports = router;
