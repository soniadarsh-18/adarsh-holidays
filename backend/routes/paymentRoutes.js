const express = require("express");
const router = express.Router();
const {
    createOrder,
    initiatePayment,
    verifyPayment,
    getPaymentStatus,
    capturePayment,
    refundPayment,
} = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-order", createOrder);
router.post("/initiate", authMiddleware, initiatePayment);
router.post("/verify", authMiddleware, verifyPayment);
router.get("/status/:bookingId", authMiddleware, getPaymentStatus);
router.post("/capture-payment", capturePayment);
router.post("/refund/:paymentId", authMiddleware, refundPayment);

module.exports = router;
