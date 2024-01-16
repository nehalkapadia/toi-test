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

// Route to create a save as draft with validation
router.post('/draft/save', verifyToken, orderController.saveOrderAsDraft);

// Route to get all order documents by order ID
router.get('/documents/:orderId', verifyToken, orderController.getAllOrderDocuments);

// Route to delete order by id
router.delete('/:orderId', verifyToken, orderController.deleteOrderById);

// Route to Soft delete order
router.post('/soft/delete/:orderId', verifyToken, orderController.softDeleteOrder);

module.exports = router;
