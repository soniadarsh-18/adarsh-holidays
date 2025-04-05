const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true, // Optimizing queries on userId
        },
        bookingId: {
            type: String,
            required: true,
            index: true, // Optimizing search by booking ID
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: "INR", // Can be USD, EUR, etc.
        },
        paymentMethod: {
            type: String,
            enum: ["Credit Card", "Debit Card", "Net Banking", "UPI", "Wallet", "Cash"],
            required: true,
        },
        paymentId: {
            type: String,
            unique: true,
            required: true,
            index: true, // Ensures uniqueness and fast retrieval
        },
        transactionId: {
            type: String,
            unique: true,
            sparse: true, // Allows multiple null values if not yet generated
        },
        status: {
            type: String,
            enum: ["Pending", "Completed", "Failed", "Refunded"],
            default: "Pending",
        },
        paymentGateway: {
            type: String,
            enum: ["Razorpay", "PayPal", "Stripe", "Paytm"],
            required: true,
        },
        refundId: {
            type: String,
            unique: true,
            sparse: true, // Only if a refund is processed
        },
        refundStatus: {
            type: String,
            enum: ["Not Requested", "Processing", "Completed", "Failed"],
            default: "Not Requested",
        },
        receiptUrl: {
            type: String, // URL to payment receipt if available
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
