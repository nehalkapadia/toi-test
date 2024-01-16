// diagnosisRoutes.js
const express = require('express')
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

const diagnosisController = require('../controllers/diagnosis.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// List of diagnoses
router.get('/search', verifyToken, diagnosisController.searchDiagnosis);


// Import bulk records
router.post('/upload', upload.single('csvFile'), diagnosisController.importDiagnosis);

module.exports = router;