const axios = require("axios");

module.exports = async function sendSMS(phoneNumber, message) {
  console.log(`📩 Sending SMS to ${phoneNumber}: ${message}`);

  const apiKey = "HAMBqvbRYVOOH4vPemF2DAZFw2w7KgAIvN378fhclAg55eKPFdVNuqcn988e"; // 🔹 Replace with your Fast2SMS API Key
  const url = "https://www.fast2sms.com/dev/bulkV2";

  try {
    const response = await axios.post(
      url,
      {
        route: "otp",
        variables_values: message,
        numbers: phoneNumber
      },
      {
        headers: {
          Authorization: apiKey
        }
      }
    );

    console.log("✅ OTP sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending OTP:", error.response ? error.response.data : error.message);
    throw new Error("Failed to send OTP");
  }
};
