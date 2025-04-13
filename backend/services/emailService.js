const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Create transporter
const transporter = nodemailer.createTransport({
    service: "gmail", // Or use your custom SMTP
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ✅ Send Login Notification Email
const sendLoginNotificationEmail = async (user) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "User Login Notification",
        html: `<!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .message { font-size: 16px; margin-bottom: 20px; }
            .footer { font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">Login Notification</div>
            <div class="message">
              <p>Hello ${user.fullName},</p>
              <p>You have successfully logged into your account.</p>
              <p>If this was not you, 
              <a href="mailto:adarshholidayss@gmail.com?subject=Unauthorized Login Attempt" 
              style="color: dodgerblue; text-decoration: underline;">Report us immediately</a>.</p>
            </div>
            <div class="footer">
              <p>Thank you,</p>
              <p>Adarsh Holidays Team</p>
            </div>
          </div>
        </body>
      </html>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("❌ Login Email Sending Error:", error);
        } else {
            console.log("✅ Login Email Sent:", info.response);
        }
    });
};

// ✅ Send Flight Booking Confirmation Email
const sendBookingConfirmationEmail = async (user, booking) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Flight Booking Confirmation – Adarsh Holidays",
        html: `<!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .message { font-size: 16px; margin-bottom: 20px; }
            .footer { font-size: 14px; color: #666; }
            .details { background-color: #f2f2f2; padding: 10px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">Flight Booking Confirmed ✈️</div>
            <div class="message">
              <p>Hello ${user.fullName},</p>
              <p>Your flight has been successfully booked. Below are the details:</p>
              <div class="details">
                <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                <p><strong>Flight Number:</strong> ${booking.flightNumber}</p>
                <p><strong>Airline:</strong> ${booking.airline}</p>
                <p><strong>From:</strong> ${booking.departure}</p>
                <p><strong>To:</strong> ${booking.arrival}</p>
                <p><strong>Departure:</strong> ${new Date(booking.departureTime).toLocaleString()}</p>
                <p><strong>Arrival:</strong> ${new Date(booking.arrivalTime).toLocaleString()}</p>
                <p><strong>Price:</strong> ₹${booking.price}</p>
                <p><strong>Status:</strong> ${booking.status}</p>
                <p><strong>Payment Status:</strong> ${booking.paymentStatus}</p>
              </div>
              <p>If you need any assistance, feel free to reach out to our support team.</p>
            </div>
            <div class="footer">
              <p>Thank you,</p>
              <p>Adarsh Holidays Team</p>
            </div>
          </div>
        </body>
      </html>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("❌ Booking Email Sending Error:", error);
        } else {
            console.log("✅ Booking Confirmation Email Sent:", info.response);
        }
    });
};

module.exports = {
    sendLoginNotificationEmail,
    sendBookingConfirmationEmail,
};
