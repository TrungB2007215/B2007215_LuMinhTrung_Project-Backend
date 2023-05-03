const express = require('express');
const router = express.Router();
const product = require('../controllers/productController');
router.get('/products', product.getProductList);
router.get('/products/:id', product.getProductById);

module.exports = router;