const axios = require("axios");
require("dotenv").config();

const RAPIDAPI_HOST = "railway-trains-india.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // Add this in .env file

const apiClient = axios.create({
    baseURL: `https://${RAPIDAPI_HOST}`,
    headers: {
        "X-RapidAPI-Host": RAPIDAPI_HOST,
        "X-RapidAPI-Key": RAPIDAPI_KEY,
    },
});

// 🔹 Search Trains Between Stations
const searchTrains = async (source, destination, journeyDate) => {
    try {
        const response = await apiClient.get(`/trainsBetweenStations`, {
            params: { source, destination, journeyDate },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching train data:", error.message);
        throw new Error("Failed to fetch train details");
    }
};

// 🔹 Get Train Live Status
const getTrainLiveStatus = async (trainNumber) => {
    try {
        const response = await apiClient.get(`/liveTrainStatus`, {
            params: { trainNo: trainNumber },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching train live status:", error.message);
        throw new Error("Failed to fetch live train status");
    }
};

module.exports = { searchTrains, getTrainLiveStatus };
