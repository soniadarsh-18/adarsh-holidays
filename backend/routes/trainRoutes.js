const express = require("express");
const {
  searchTrains,
  bookTrain,
  getUserTrainBookings,
  updateTrainBooking,
  deleteTrainBooking,
} = require("../controllers/trainController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 Search Trains
router.post("/search", authMiddleware, searchTrains);

// 🔹 Book Train Ticket
router.post("/book", bookTrain);

// 🔹 Get User Train Bookings
router.get("/user-bookings/:userId", getUserTrainBookings);

// 🔹 Update Train Booking
router.put("/update/:bookingId", updateTrainBooking);

// 🔹 Cancel/Delete Train Booking
router.delete("/delete/:id", deleteTrainBooking);

module.exports = router;
