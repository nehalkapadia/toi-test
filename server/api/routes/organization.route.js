// Require Packages
const express = require('express');
const router = express.Router();
const { checkSchema } = require('express-validator');

// require Controllers
const organizationController = require('../controllers/organization.controller');

// Require middlewares
const { validate } = require('../middlewares/validate.middleware');

// Require validators
const organizationValidator = require('../validators/organization.validator');
const { verifyToken } = require('../middlewares/auth.middleware');

// User list route
router.get('/:id', verifyToken, organizationController.detail);
router.get('/user/list', verifyToken, organizationController.getOrganizationUsers)
router.post('/list', verifyToken, organizationController.list);
router.post(
  '/',
  verifyToken,
  validate(checkSchema(organizationValidator.createOrganizationSchema)),
  organizationController.create
);
router.put('/:id', verifyToken, organizationController.update);
router.delete('/:id', verifyToken, organizationController.delete);

module.exports = router;
