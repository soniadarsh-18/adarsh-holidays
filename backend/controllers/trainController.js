const axios = require("axios");
const mongoose = require("mongoose");
const TrainBooking = require("../models/TrainBooking");
const User = require("../models/User");
require("dotenv").config();

// 🔹 Search Trains
const searchTrains = async (req, res) => {
  try {
    const { searchTerm } = req.body;

    // Validate required field
    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    // Fetch all trains based on the search term
    const requestBody = {
      search: searchTerm, // Only the "search" parameter is allowed
    };

    console.log("Request Body:", requestBody); // Debugging: Log the request body

    const response = await axios.post(
      "https://trains.p.rapidapi.com/v1/railways/trains/india",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "trains.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY, // Ensure this is set in your .env
        },
      }
    );

    console.log("API Response:", response.data); // Debugging: Log the full API response

    // Extract unique filter options from the search results
    const trains = response.data;

    const fromOptions = [...new Set(trains.map((train) => train.source))];
    const toOptions = [...new Set(trains.map((train) => train.destination))];
    const departureOptions = [...new Set(trains.map((train) => train.departureTime.split('T')[0]))]; // Extract date only
    const travelClassOptions = [...new Set(trains.flatMap((train) => train.classes))];

    // Return filter options and search results to the frontend
    res.status(200).json({
      filterOptions: {
        from: fromOptions,
        to: toOptions,
        departure: departureOptions,
        travelClass: travelClassOptions,
      },
      trains: trains,
    });
  } catch (error) {
    console.error("Error searching trains:", error.message);
    console.error("Error details:", error.response?.data); // Debugging: Log the full error response
    res.status(500).json({ message: "Failed to search trains", error: error.response?.data || error.message });
  }
};

// 🔹 Book Train Ticket
const bookTrain = async (req, res) => {
  try {
    const {
      userId,
      trainNumber,
      trainName,
      source,
      destination,
      departureTime,
      arrivalTime,
      price,
      travelClass,
      passengers,
    } = req.body;

    if (
      !userId ||
      !trainNumber ||
      !trainName ||
      !source ||
      !destination ||
      !departureTime ||
      !arrivalTime ||
      !price ||
      !passengers ||
      passengers.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required data" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid user ID format" });
    }

    const mongoUserId = new mongoose.Types.ObjectId(userId);

    const newBooking = new TrainBooking({
      userId: mongoUserId,
      bookingId: `TRAIN${Date.now()}`,
      trainNumber,
      trainName,
      source,
      destination,
      departureTime,
      arrivalTime,
      travelClass,
      price,
      status: "Booked",
      passengers,
      paymentStatus: "Pending",
    });

    await newBooking.save();

    const updatedUser = await User.findByIdAndUpdate(
      mongoUserId,
      { $push: { bookings: newBooking } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Train booked successfully",
      booking: newBooking,
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Error booking train:", error.message);
    res.status(500).json({ success: false, error: "Train booking failed" });
  }
};

// 🔹 Get User Train Bookings
const getUserTrainBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, error: "Invalid user ID format" });
    }

    const bookings = await TrainBooking.find({ userId: new mongoose.Types.ObjectId(userId) });

    console.log("Bookings found:", bookings); // Debugging line

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("❌ Error fetching user bookings:", error);
    res.status(500).json({ success: false, error: "Failed to fetch bookings" });
  }
};

// 🔹 Update Train Booking
const updateTrainBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updateData = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { "bookings.bookingId": bookingId, "bookings.bookingType": "train" },
      { $set: { "bookings.$": { ...updateData } } },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, error: "Train booking not found" });
    }

    res.json({
      success: true,
      message: "Train booking updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("❌ Error updating train booking:", error.message);
    res
      .status(500)
      .json({ success: false, error: "Failed to update train booking" });
  }
};

// 🔹 Delete Train Booking
// 🔹 Delete Train Booking
const deleteTrainBooking = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL

    let booking;

    // 🔍 Check if ID is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      booking = await TrainBooking.findById(id); // Find by _id
    } else {
      booking = await TrainBooking.findOne({ bookingId: id }); // Find by bookingId
    }

    if (!booking) {
      return res.status(404).json({ success: false, error: "Train booking not found" });
    }

    // 🗑 Delete booking
    await TrainBooking.deleteOne({ _id: booking._id });

    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting booking:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


module.exports = {
  searchTrains,
  bookTrain,
  getUserTrainBookings,
  updateTrainBooking,
  deleteTrainBooking,
};
