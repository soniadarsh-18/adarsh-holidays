const fetch = require("node-fetch");
const FlightBooking = require("../models/FlightBooking");
require("dotenv").config();

let accessToken = null;
let tokenExpiry = null;

// **Function to Get a New Bearer Token**
async function getAccessToken() {
  if (accessToken && tokenExpiry && tokenExpiry > Date.now()) {
    console.log("✅ Using Cached Access Token");
    return accessToken;
  }

  try {
    const response = await fetch(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: process.env.AMADEUS_CLIENT_ID,
          client_secret: process.env.AMADEUS_CLIENT_SECRET,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch token: ${response.statusText}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000;

    console.log(
      "🔑 New Bearer Token Acquired, Expires In:",
      data.expires_in,
      "seconds"
    );
    return accessToken;
  } catch (error) {
    console.error("❌ Token Fetch Error:", error.message);
    return null;
  }
}

// **Function to Format Flight Data**
function formatFlightData(apiResponse) {
  if (!apiResponse || !apiResponse.data || apiResponse.data.length === 0) {
    return { error: "No flights found" };
  }

  return apiResponse.data.map((flight) => {
    const itinerary = flight.itineraries[0];
    const segment = itinerary.segments[0];
    const airlineName =
      apiResponse.dictionaries?.carriers?.[segment.carrierCode] ||
      segment.carrierCode;

    return {
      flightId: flight.id,
      airline: airlineName,
      flightNumber: segment.number,
      departure: {
        airport: segment.departure.iataCode,
        terminal: segment.departure.terminal || "N/A",
        time: segment.departure.at,
      },
      arrival: {
        airport: segment.arrival.iataCode,
        terminal: segment.arrival.terminal || "N/A",
        time: segment.arrival.at,
      },
      duration: itinerary.duration
        .replace("PT", "")
        .replace("H", "h ")
        .replace("M", "m"),
      price: {
        currency: flight.price.currency,
        total: flight.price.total,
      },
      baggage: flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]
        ?.includedCheckedBags?.weight
        ? `${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weight} KG`
        : "Not Included",
      seatsAvailable: flight.numberOfBookableSeats,
    };
  });
}

// **Search Flights**
async function searchFlights(params) {
  const token = await getAccessToken();
  if (!token) return { error: "❌ Failed to authenticate with Amadeus API" };

  try {
    const queryParams = new URLSearchParams({
      originLocationCode: params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.departureDate,
      adults: params.adults.toString(),
      travelClass: params.cabinClass.toUpperCase(),
      currencyCode: params.currency || "USD",
      max: params.maxResults.toString(),
    });

    if (params.returnDate) queryParams.append("returnDate", params.returnDate);

    const response = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `API responded with ${response.status}: ${response.statusText}`
      );
    }

    const flightData = await response.json();
    return formatFlightData(flightData);
  } catch (error) {
    console.error("❌ Flight API Error:", error.message);
    return { error: "Flight search failed" };
  }
}

// **Book a Flight**
async function bookFlight(userId, flightOffer) {
  const token = await getAccessToken();
  if (!token) return { error: "❌ Failed to authenticate with Amadeus API" };

  try {
    const response = await fetch(
      "https://test.api.amadeus.com/v1/booking/flight-orders",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { flightOffers: [flightOffer] } }),
      }
    );

    if (!response.ok) {
      throw new Error(`Booking failed: ${response.statusText}`);
    }

    const bookingData = await response.json();
    const flight = bookingData.flightOffers[0].itineraries[0].segments[0];

    // Save booking in database
    const newBooking = new FlightBooking({
      userId,
      bookingId: bookingData.id,
      flightNumber: flight.carrierCode + flight.number,
      airline: flight.carrierCode,
      departure: flight.departure.iataCode,
      arrival: flight.arrival.iataCode,
      departureTime: flight.departure.at,
      arrivalTime: flight.arrival.at,
      price: bookingData.flightOffers[0].price.total,
    });

    await newBooking.save();
    return { success: true, booking: newBooking };
  } catch (error) {
    console.error("❌ Booking Error:", error.message);
    return { error: "Booking failed" };
  }
}

// **Retrieve User Bookings**
async function getUserBookings(userId) {
  try {
    const bookings = await FlightBooking.find({ userId });
    if (!bookings.length) return { error: "No bookings found" };
    return { success: true, bookings };
  } catch (error) {
    console.error("❌ Fetching Bookings Error:", error.message);
    return { error: "Failed to retrieve bookings" };
  }
}

// **Update a Booking**
async function updateBooking(bookingId, updateData) {
  try {
    const updatedBooking = await FlightBooking.findOneAndUpdate(
      { bookingId },
      updateData,
      { new: true }
    );

    if (!updatedBooking) return { error: "Booking not found" };
    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error("❌ Update Booking Error:", error.message);
    return { error: "Failed to update booking" };
  }
}

// **Cancel/Delete a Booking**
async function deleteBooking(bookingId) {
  try {
    const deletedBooking = await FlightBooking.findOneAndDelete({ bookingId });
    if (!deletedBooking) return { error: "Booking not found" };
    return { success: true, message: "Booking cancelled successfully" };
  } catch (error) {
    console.error("❌ Cancel Booking Error:", error.message);
    return { error: "Failed to cancel booking" };
  }
}

module.exports = {
  getAccessToken,
  searchFlights,
  bookFlight,
  getUserBookings,
  updateBooking,
  deleteBooking,
};
