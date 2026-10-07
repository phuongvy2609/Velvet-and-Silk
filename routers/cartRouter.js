const express = require('express');
const router = express.Router();

const {  
    addToCart,
    getCart,
    updateCart,
    deleteCart,
    getCartCount,
    buyNow,
    getBuyNow
} = require('../controllers/cartController');


router.post('/add-to-cart', addToCart);
router.get('/get-cart', getCart);
router.post('/update-cart', updateCart);
router.delete('/delete-cart', deleteCart);
router.get('/cart-count', getCartCount);
router.post('/buy-now', buyNow);
router.get('/get-buy-now', getBuyNow);


module.exports = router;


