const axios = require("axios");
require("dotenv").config();
const FlightBooking = require("../models/FlightBooking");
const mongoose = require("mongoose");
const User = require("../models/User"); // Import User model

// Store Amadeus API Token and Expiry Time
let AMADEUS_ACCESS_TOKEN = "";
let AMADEUS_TOKEN_EXPIRY = 0; // Store expiry time (epoch timestamp)

// 🔹 Fetch Amadeus API Token (OAuth)
const getAmadeusToken = async () => {
  try {
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_API_KEY,
        client_secret: process.env.AMADEUS_API_SECRET,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    AMADEUS_ACCESS_TOKEN = response.data.access_token;
    AMADEUS_TOKEN_EXPIRY = Date.now() + response.data.expires_in * 1000;

    console.log("✅ New Amadeus Access Token Fetched:", AMADEUS_ACCESS_TOKEN);
  } catch (error) {
    console.error(
      "❌ Error fetching Amadeus token:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to fetch Amadeus token");
  }
};

// 🔹 Validate Amadeus Token Before API Calls
const ensureValidToken = async () => {
  if (!AMADEUS_ACCESS_TOKEN || Date.now() >= AMADEUS_TOKEN_EXPIRY) {
    console.log("🔄 Fetching a new Amadeus token...");
    await getAmadeusToken();
  }
};

// 🔹 Search Flights
const searchFlights = async (req, res) => {
  try {
    const { origin, destination, departureDate, returnDate, adults } =
      req.query;

    if (!origin || !destination || !departureDate || !adults) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required parameters" });
    }

    await ensureValidToken();

    const response = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        headers: { Authorization: `Bearer ${AMADEUS_ACCESS_TOKEN}` },
        params: {
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate,
          returnDate,
          adults,
          currencyCode: "USD",
          max: 5,
        },
      }
    );

    res.json({ success: true, flights: response.data.data });
  } catch (error) {
    console.error(
      "❌ Error searching flights:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ success: false, error: "Flight search failed" });
  }
};

// 🔹 Book Flight (Save in MongoDB)
const bookFlight = async (req, res) => {
  try {
    console.log("📥 Incoming request body:", JSON.stringify(req.body, null, 2));

    const { userId, flightOffer, passengers } = req.body;

    // Validate required fields
    if (!userId || !flightOffer || !passengers || passengers.length === 0) {
      console.error("❌ Missing required data:", { userId, flightOffer, passengers });
      return res.status(400).json({ success: false, error: "Missing required data" });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("❌ Invalid user ID format:", userId);
      return res.status(400).json({ success: false, error: "Invalid user ID format" });
    }
    const mongoUserId = new mongoose.Types.ObjectId(userId);

    // Validate flightOffer structure
    if (!flightOffer.itineraries || flightOffer.itineraries.length === 0) {
      console.error("❌ Invalid flight offer structure", flightOffer);
      return res.status(400).json({ success: false, error: "Invalid flight offer format" });
    }

    // Ensure at least one segment exists
    const firstItinerary = flightOffer.itineraries[0];
    if (!firstItinerary || !firstItinerary.segments || firstItinerary.segments.length === 0) {
      console.error("❌ Missing first itinerary segments");
      return res.status(400).json({ success: false, error: "Missing itinerary segments" });
    }

    const lastItinerary = flightOffer.itineraries[flightOffer.itineraries.length - 1];
    if (!lastItinerary || !lastItinerary.segments || lastItinerary.segments.length === 0) {
      console.error("❌ Missing last itinerary segments");
      return res.status(400).json({ success: false, error: "Missing last itinerary segments" });
    }

    // Extract first and last segments
    const firstSegment = firstItinerary.segments[0];
    const lastSegment = lastItinerary.segments[lastItinerary.segments.length - 1];

    if (!firstSegment || !lastSegment) {
      console.error("❌ Missing flight segment details");
      return res.status(400).json({ success: false, error: "Incomplete flight segment details" });
    }

    // Extract flight details safely
    const flightNumber = firstSegment.number || firstSegment.flightNumber || "Unknown";
    const airline = flightOffer.validatingAirlineCodes?.[0] || "Unknown";
    const departure = firstSegment.departure?.iataCode || "N/A";
    const arrival = lastSegment.arrival?.iataCode || "N/A";
    const departureTime = firstSegment.departure?.at || "N/A";
    const arrivalTime = lastSegment.arrival?.at || "N/A";
    const price = parseFloat(flightOffer.price?.total) || 0.0;

    // Validate passengers array
    if (!Array.isArray(passengers) || passengers.some((p) => !p.name || !p.age || !p.gender)) {
      console.error("❌ Invalid passengers format", passengers);
      return res.status(400).json({ success: false, error: "Invalid passengers format" });
    }

    // Create new flight booking
    const newBooking = new FlightBooking({
      userId: mongoUserId,
      bookingId: `BOOK${Date.now()}`,
      flightNumber,
      airline,
      departure,
      arrival,
      departureTime,
      arrivalTime,
      price,
      status: "Booked",
      passengers,
      paymentStatus: "Pending",
    });

    // Save booking to database
    await newBooking.save();

    // Add booking reference to user document
    const updatedUser = await User.findByIdAndUpdate(
      mongoUserId,
      {
        $push: {
          bookings: {
            _id: newBooking._id,
            bookingId: newBooking.bookingId,
            flightNumber: newBooking.flightNumber,
            airline: newBooking.airline,
            departure: newBooking.departure,
            arrival: newBooking.arrival,
            departureTime: newBooking.departureTime,
            arrivalTime: newBooking.arrivalTime,
            price: newBooking.price,
            status: newBooking.status,
            paymentStatus: newBooking.paymentStatus,
            createdAt: newBooking.createdAt,
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error("❌ User not found for ID:", userId);
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(201).json({
      success: true,
      message: "Flight booked successfully",
      booking: newBooking,
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Error booking flight:", error);
    res.status(500).json({
      success: false,
      error: "Flight booking failed",
      details: error.message,
    });
  }
};


// 🔹 Get User Bookings
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID." });
    }

    // ✅ Fetch user bookings from `flightbookings` collection
    const bookings = await FlightBooking.find({ userId });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ success: false, message: "No flight bookings found." });
    }

    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({ success: false, message: "Server error while fetching bookings." });
  }
};


const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updateData = req.body;

    // ✅ Validate if booking exists
    const user = await User.findOne({ "bookings.bookingId": bookingId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    // ✅ Update booking inside `bookings[]`
    const updatedUser = await User.findOneAndUpdate(
      { "bookings.bookingId": bookingId },
      {
        $set: {
          "bookings.$": {
            ...user.bookings.find((b) => b.bookingId === bookingId),
            ...updateData,
          },
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Booking updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("❌ Error updating booking:", error.message);
    res.status(500).json({ success: false, error: "Failed to update booking" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // ✅ Validate `bookingId`
    if (!bookingId) {
      return res.status(400).json({ success: false, error: "Booking ID is required" });
    }

    console.log(`🛑 Deleting Booking with ID: ${bookingId}`);

    // ✅ Find user who has this booking
    const updatedUser = await User.findOneAndUpdate(
      { "bookings.bookingId": bookingId }, // Find user with this bookingId
      { $pull: { bookings: { bookingId } } }, // Remove the booking from user's bookings array
      { new: true }
    );

    // ✅ If no user found, booking doesn't exist
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    console.log(`✅ Booking ${bookingId} deleted successfully`);

    return res.json({
      success: true,
      message: "Booking deleted successfully",
      updatedUser, // Optionally return user data if needed
    });

  } catch (error) {
    console.error("❌ Error deleting booking:", error);
    res.status(500).json({ success: false, error: "Failed to delete booking" });
  }
};



// 🔹 Export Controllers
module.exports = {
  getAmadeusToken,
  searchFlights,
  bookFlight,
  getUserBookings,
  updateBooking,
  deleteBooking,
};