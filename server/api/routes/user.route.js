// Require Packages
const express = require('express');
const router = express.Router();
const { checkSchema } = require('express-validator');

// require Controllers
const userController = require('../controllers/user.controller');

// Require middlewares
const { validate } = require('../middlewares/validate.middleware');

// Require validators
const userValidator = require('../validators/user.validator');
const { verifyToken } = require('../middlewares/auth.middleware');

// User list route
router.get('/', verifyToken, userController.list);
router.post('/list', verifyToken, userController.allList);
router.get('/:id', verifyToken, userController.detail);
router.post(
  '/',
  verifyToken,
  validate(checkSchema(userValidator.createUserSchema)),
  userController.create
);
router.put('/:id', verifyToken, userController.update);
router.delete('/:id', verifyToken, userController.delete);

module.exports = router;
