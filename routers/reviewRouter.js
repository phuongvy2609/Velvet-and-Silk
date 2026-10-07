const express = require ('express');
const router = express.Router();
const { 
    addReview, 
    getAllReview, 
    deleteReview, 
    replyReview, 
    getAllReviewadmin, 
    fixReplyReview,
    checkPurchasedProduct
 } = require('../controllers/reviewController');
const isAdmin = require('../middleware/isAdmin');


router.post('/addreview', addReview);
router.get('/getallreview', isAdmin, getAllReview);
router.delete('/deletereview', isAdmin, deleteReview);
router.put('/replyreview', isAdmin, replyReview);
router.put('/fixReplyReview', isAdmin, fixReplyReview )
router.get('/reviews/:product_id', getAllReviewadmin);
router.get("/check-purchased/:product_id", checkPurchasedProduct);


module.exports = router;