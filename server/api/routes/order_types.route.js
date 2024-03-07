const express = require('express');
const router = express.Router();
const orderTypeController = require('../controllers/order_types.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Define route to list order types
router.get('/list', verifyToken, orderTypeController.listOrderTypes);

module.exports = router;
