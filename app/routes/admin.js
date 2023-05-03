// admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const upload = require('../middleware/upload');

router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.post('/products', upload.single('image'), adminController.createProduct);

router.put('/products/:id', upload.single('image'),adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);


module.exports = router;
