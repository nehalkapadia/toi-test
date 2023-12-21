const express = require('express');
const router = express.Router();

const orderAuthDocumentController = require('../controllers/order_auth_document.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, orderAuthDocumentController.list);
router.post('/', verifyToken, orderAuthDocumentController.create);
router.delete('/:id', verifyToken, orderAuthDocumentController.delete);

module.exports = router;