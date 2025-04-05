const Payment = require("../models/Payment");
const FlightBooking = require("../models/FlightBooking");
const Razorpay = require("razorpay"); // Using Razorpay as an example
const crypto = require("crypto");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

// ✅ Initialize Razorpay Instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        // Convert amount from rupees to paise (integer)
        const amountInPaise = Math.round(amount * 100);

        const options = {
            amount: amountInPaise, // Razorpay expects amount in paise
            currency: currency || "INR",
            receipt: `order_rcptid_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Order creation failed", error });
    }
};

// ✅ Initiate Payment
exports.initiatePayment = async (req, res) => {
    try {
        const { bookingId, amount, paymentMethod } = req.body;
        const userId = req.user.id;

        // Check if the booking exists
        const booking = await FlightBooking.findOne({ bookingId: req.body.bookingId });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Create order in Razorpay
        const order = await razorpay.orders.create({
            amount: amount * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `receipt_${bookingId}`,
        });

        // Save payment record
        const payment = new Payment({
            userId,
            bookingId,
            paymentId: order.id,
            amount,
            paymentMethod,
            paymentGateway: "Razorpay",
            status: "Pending",
        });

        await payment.save();
        res.status(200).json({ order, message: "Payment initiated" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


// ✅ Verify Payment
// ✅ Verify Payment
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return res.status(400).json({ message: "Missing required payment details" });
        }

        // ✅ Generate expected signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid signature. Payment verification failed." });
        }

        // ✅ Find and update payment record
        const payment = await Payment.findOneAndUpdate(
            { orderId: razorpay_order_id }, // ✅ Ensure orderId matches
            { status: "Completed", transactionId: razorpay_payment_id },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ message: "Payment record not found." });
        }

        // ✅ Ensure bookingId exists before updating FlightBooking
        if (!payment.bookingId) {
            return res.status(404).json({ message: "Booking not found in payment record." });
        }

        let booking;

        // ✅ Check if bookingId is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(payment.bookingId)) {
            booking = await FlightBooking.findByIdAndUpdate(payment.bookingId, {
                paymentStatus: "Completed"
            }, { new: true });
        } else {
            // ✅ If bookingId is a custom string, use findOne instead
            booking = await FlightBooking.findOneAndUpdate(
                { bookingId: payment.bookingId }, // Assuming bookingId is stored separately
                { paymentStatus: "Completed" },
                { new: true }
            );
        }

        if (!booking) {
            return res.status(404).json({ message: "Booking not found, but payment verified." });
        }

        res.status(200).json({ message: "Payment verified successfully", payment, booking });
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ message: "Verification failed due to an error", error: error.message });
    }
};



// ✅ Get Payment Status
exports.getPaymentStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const payment = await Payment.findOne({ bookingId });

        if (!payment) return res.status(404).json({ message: "Payment not found" });

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payment status", error });
    }
};

// ✅ Refund Payment
exports.refundPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findOne({ paymentId });
        if (!payment) return res.status(404).json({ message: "Payment not found" });

        const refund = await razorpay.payments.refund(payment.transactionId);

        await Payment.findByIdAndUpdate(payment._id, {
            refundId: refund.id,
            refundStatus: "Processing",
        });

        res.status(200).json({ message: "Refund initiated", refund });
    } catch (error) {
        res.status(500).json({ message: "Refund failed", error });
    }
};

// ✅ Capture Payment using Razorpay SDK
// Capture Payment
exports.capturePayment = async (req, res) => {
    try {
        const { paymentId, amount } = req.body;

        if (!paymentId || !amount) {
            return res.status(400).json({ message: "Payment ID and Amount are required" });
        }

        // Convert amount to paise
        const amountInPaise = Math.round(amount * 100);

        // Capture the payment using Razorpay API
        const razorpayResponse = await axios.post(
            `https://api.razorpay.com/v1/payments/${paymentId}/capture`,
            { amount: amountInPaise, currency: "INR" },
            {
                auth: {
                    username: process.env.RAZORPAY_KEY_ID,  // ✅ Fixed Credentials
                    password: process.env.RAZORPAY_KEY_SECRET,
                },
            }
        );

        res.json({ success: true, message: "Payment captured successfully", data: razorpayResponse.data });

    } catch (error) {
        console.error("Payment Capture Error:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: "Payment capture failed",
            error: error.response ? error.response.data : error.message
        });
    }
};
