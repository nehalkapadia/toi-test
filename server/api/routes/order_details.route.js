const express = require('express');
const router = express.Router();
const orderDetailsController = require('../controllers/order_details.controller');
const { validate } = require('../middlewares/validate.middleware');
const {
  createOrderDetailsSchema,
} = require('../validators/order_details.validator');
const { verifyToken } = require('../middlewares/auth.middleware');

// Define route for orderDetails
router.post(
  '/create',
  verifyToken,
  validate(createOrderDetailsSchema),
  orderDetailsController.createOrderDetails
);

module.exports = router;
