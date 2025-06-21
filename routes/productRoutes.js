const express = require('express');
const router = express.Router();
const auth = require('../utils/authMiddleware'); 
const { addProduct, getProducts, buyProduct } = require('../controllers/productController');

router.post('/product', auth, addProduct);
router.get('/product', getProducts);
router.post('/buy', auth, buyProduct);


module.exports = router;
