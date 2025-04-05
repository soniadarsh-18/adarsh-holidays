const axios = require("axios");
require("dotenv").config();

const AMADEUS_API_URL = "https://test.api.amadeus.com";
const API_KEY = process.env.AMADEUS_API_KEY;
const API_SECRET = process.env.AMADEUS_API_SECRET;

let accessToken = null;

// Function to get Amadeus Access Token
const getAuthToken = async () => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", API_KEY);
    params.append("client_secret", API_SECRET);

    const response = await axios.post(
      `${AMADEUS_API_URL}/v1/security/oauth2/token`,
      params,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    accessToken = response.data.access_token;
    console.log("Amadeus Access Token:", accessToken);
    return accessToken;
  } catch (error) {
    console.error(
      "Error fetching Amadeus token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to authenticate with Amadeus.");
  }
};

// Middleware to ensure valid token
const ensureAuthToken = async (req, res, next) => {
  if (!accessToken) {
    try {
      accessToken = await getAuthToken();
    } catch (error) {
      return res.status(500).json({ error: "Authentication failed." });
    }
  }
  req.accessToken = accessToken;
  next();
};

module.exports = { getAuthToken, ensureAuthToken };
