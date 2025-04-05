const mongoose = require("mongoose");

const TrainBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },
    apiBookingId: {
      type: String,
      unique: true,
      sparse: true, // ✅ Allows multiple null values
    },
    trainNumber: {
      type: String,
      required: true,
    },
    trainName: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    travelClass: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Booked", "Cancelled", "Updated"],
      default: "Booked",
    },
    passengers: [
      {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: {
          type: String,
          enum: ["Male", "Female", "Other"],
          required: true,
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrainBooking", TrainBookingSchema);
