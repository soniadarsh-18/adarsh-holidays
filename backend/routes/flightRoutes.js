const express = require("express");
const {
  searchFlights,
  bookFlight,
  getUserBookings,
  updateBooking,
  deleteBooking,
} = require("../controllers/flightController");

const router = express.Router();

// Flight Search API
router.post("/search", searchFlights);

// Flight Booking API
router.post("/book", bookFlight);

// Retrieve User Bookings
router.get("/user-bookings/:userId", getUserBookings);

// Update a Flight Booking
router.put("/update/:bookingId", updateBooking);

// Cancel/Delete a Flight Booking
router.delete("/delete/:bookingId", deleteBooking);


module.exports = router;
