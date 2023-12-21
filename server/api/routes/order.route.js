// routes/orderRoutes.js
const express = require('express');
const router = express.Router();

// Require middlewares
const { validate } = require('../middlewares/validate.middleware');

const orderController = require('../controllers/order.controller');
const { createOrderSchema } = require('../validators/order.validator');
const { verifyToken } = require('../middlewares/auth.middleware');

// Route to create a new order with validation
router.post('/', verifyToken, validate(createOrderSchema), orderController.createOrder);

// Route to list orders with pagination and sorting
router.put('/:orderId', verifyToken, orderController.updateOrder);

// Route to get an order by ID
router.get('/:orderId', verifyToken, orderController.getOrderById);

// Route to list orders with pagination and sorting
router.post('/list', verifyToken, orderController.listOrders);

// get uploaded documents for an order
router.get('/files/:orderId', verifyToken, orderController.getUploadedDocuments);


module.exports = router;
