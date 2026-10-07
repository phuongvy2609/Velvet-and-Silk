const express = require('express');
const router = express.Router();

const { 
    createOrder, 
    getOrderById, 
    getOrderProducts, 
    getOrderHistory, 
    cancelOrder, 
    getAllOrders, 
    updateOrderStatus, 
    deleteOrder, 
    getOrderOverview,
    syncMembershipRank
} = require('../controllers/orderController');
const isAdmin = require('../middleware/isAdmin');

router.post('/createOrder', createOrder);
router.get('/orders/:order_id', getOrderById);
router.get('/order-products/:order_id', getOrderProducts);
router.get('/order-history/:user_id', getOrderHistory);
router.put('/cancel-order/:order_id', cancelOrder);
router.get('/getallorders', isAdmin, getAllOrders);
router.put('/orders/:order_id/status', updateOrderStatus);
router.delete('/orders/:order_id', isAdmin, deleteOrder);
router.get('/order-overview', getOrderOverview);
router.get('/sync-membership-rank', syncMembershipRank);

module.exports = router;