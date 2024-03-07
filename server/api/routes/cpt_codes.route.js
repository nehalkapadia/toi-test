const express = require('express')
const router = express.Router();

const cptCodesController = require('../controllers/cpt_codes.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// List of CptCodes
router.get('/search', verifyToken, cptCodesController.searchCPTCode);

module.exports = router;