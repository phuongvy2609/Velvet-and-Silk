const express = require("express");
const router = express.Router();
const { 
    addVoucher,
    getVouchers,
    updateVoucher,
    deleteVoucher,
    decreaseVoucherQuantity
}= require("../controllers/voucherController");

router.post("/addvoucher", addVoucher);
router.get("/getvouchers", getVouchers);
router.put("/updatevoucher/:id", updateVoucher);
router.delete("/deletevoucher/:id", deleteVoucher)
router.post("/decrease-voucher", decreaseVoucherQuantity);

module.exports = router;