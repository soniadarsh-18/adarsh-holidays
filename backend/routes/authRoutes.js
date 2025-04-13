const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const mongoose = require("mongoose");
const router = express.Router();
const cors = require("cors");
const { resetPassword } = require("../controllers/userController"); // Import controller function

// ✅ Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use SMTP settings for a custom domain
  auth: {
    user: process.env.EMAIL_USER, // Set in .env file
    pass: process.env.EMAIL_PASS, // Set in .env file
  },
});

// ✅ Register Route with Email Verification
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already registered. Try logging in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex"); // Generate verification token

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      verificationToken, // Store token in DB
      isVerified: false, // Mark user as unverified
    });

    await user.save();

    // ✅ Send Email Verification Link
    const verificationLink = `https://adarsh-holidays-backend-production.up.railway.app/api/auth/verify-email/${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Account ",
      html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .container {
            max-width: 500px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            margin: auto;
        }
        h2 {
            color: #007bff;
        }
        p {
            font-size: 16px;
            color: #555;
        }
        .verify-button {
            display: inline-block;
            padding: 12px 20px;
            margin: 20px 0;
            text-decoration: none;
            font-weight: bold;
            background-color: #007bff;
            color: white;
            border-radius: 5px;
        }
        .verify-button:hover {
            background-color: #0056b3;
        }
        .footer {
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>
<body>

    <div class="container">
        <h2>Welcome to Tours & Travels! 🌍✈️</h2>
        <p>Thank you for signing up with us! You're just one step away from unlocking amazing travel experiences.</p>
        <p>Click the button below to verify your email and get started:</p>

        <a href="${verificationLink}" class="verify-button">Verify My Email</a>

        <p>If the button above doesn't work, you can also use the following link:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>

        <p>This link will expire in <strong>24 hours</strong>. If you didn’t request this, please ignore this email.</p>

        <div class="footer">
            <p>Best Regards,<br><strong>Tours & Travels Team</strong></p>
            <p>📧 support@tourstravels.com | 📍 123 Travel St, Wanderland</p>
        </div>
    </div>

</body>
</html>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message:
        "User registered successfully. Check your email to verify your account.",
    });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
});

// Login Route (User Authentication)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate Input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // ✅ Check if user exists
    const user = await User.findOne({ email }).select("+password +isVerified");
    if (!user) {
      return res.status(400).json({ message: "Email is not registered. Please sign up first." });
    }

    // ✅ Prevent login if user is not verified
    if (!user.isVerified) {
      return res.status(401).json({ message: "Email not verified. Please check your inbox." });
    }

    // ✅ Compare Entered Password with Hashed Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password. Please try again." });
    }

    // ✅ Generate JWT Token for Authentication
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // ✅ Increased Token Expiry to 7 Days
    });

    // ✅ Store Token in HTTP-Only Secure Cookie
    res.cookie("token", token, {
      httpOnly: true, // ✅ Prevents XSS Attacks
      secure: process.env.NODE_ENV === "production", // ✅ Secure in Production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
    });

    // ✅ Check if Login Notification Emails are Disabled
    if (!user.settings?.disableLoginEmails) {
      console.log("📧 Sending Login Notification Email...");

      // ✅ Send User Login Notification Email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
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
                  <p>If this was not you, <a href="mailto:adarshholidayss@gmail.com?subject=Unauthorized Login Attempt&body=Hi%20Adarsh%20Holidays%20Team,%0A%0AI%20am%20[Add%20your%20name]%20and%20I%20found%20that%20a%20login%20was%20made%20through%20my%20account%20[Add%20your%20email%20ID].%20I%20was%20not%20aware%20of%20this,%20so%20please%20check%20and%20let%20me%20know%20the%20details.%0A%0ALooking%20forward%20to%20your%20prompt%20response.%0A%0AThank%20you,%0A[Your%20Name]" 
style="color: dodgerblue; text-decoration: underline;">
Report
</a>

 us immediately.</p>
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
          console.error("❌ Email Sending Error:", error);
        } else {
          console.log("✅ Login Notification Email Sent:", info.response);
        }
      });
    } else {
      console.log("🚫 Login Notification Emails are Disabled for this User.");
    }

    // ✅ Return Token in Response Body for LocalStorage Usage
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
});

/**
 * ✅ Forgot Password: Generates a reset token and sends it via email
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("🔹 Forgot Password Request for:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User Not Found");
      return res
        .status(400)
        .json({ error: "User with this email does not exist" });
    }

    // ✅ Generate token and expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = Date.now() + 3600000; // Valid for 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    console.log("✅ Password Reset Token Generated:", resetToken);

    // ✅ Use localhost for testing instead of Netlify
    const resetLink = `https://adarsh-holidays-backend-production.up.railway.app/authentication/reset-password.html?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset your password",
      html: `
                <p>Hello <strong>${user.fullName || "User"}</strong>,</p>
                <p>You requested a password reset. Click the button below to reset your password:</p>
                <a href="${resetLink}" 
                   style="display:inline-block; padding:10px 20px; color:#fff; background-color:#007bff; 
                   text-decoration:none; border-radius:5px;">
                   Reset Password
                </a>
                <p>If the button above doesn't work, you can also use the following link:</p>
                <p><a href="${resetLink}">${resetLink}</a></p>
                <p>If you did not request this, please ignore this email.</p>
            `,
    };

    await transporter.sendMail(mailOptions);

    console.log("📧 Password reset email sent to:", user.email);
    res.json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Define CORS Middleware for Reset Password Route
const resetPasswordCors = cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:3000"],
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-reset-token"],
  credentials: true,
});

// ✅ Reset Password Route with CORS Middleware
router.post("/reset-password/:token?", resetPasswordCors, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("✅ Reset Password API Hit");

    // Handle CORS Preflight Request
    if (req.method === "OPTIONS") {
      console.log("🔹 Preflight CORS Request Handled");
      return res.status(204).send(); // ✅ Send 204 No Content for Preflight Requests
    }

    // Extract token from headers or URL params
    const token = req.params.token || req.headers["x-reset-token"];
    const { password, confirmPassword } = req.body;

    console.log("📢 Received Body:", req.body);
    console.log("🔹 Received Token (Header):", req.headers["x-reset-token"]);
    console.log("🔹 Received Token (Param):", req.params.token);

    if (!token) {
      console.error("❌ Reset token is missing.");
      return res.status(400).json({ error: "Reset token is missing." });
    }

    if (!password || !confirmPassword) {
      console.error("❌ Missing password fields.");
      return res
        .status(400)
        .json({ error: "Both password fields are required." });
    }

    if (password.trim() === "" || confirmPassword.trim() === "") {
      console.error("❌ Password fields cannot be empty.");
      return res
        .status(400)
        .json({ error: "Password fields cannot be empty." });
    }

    if (password.length < 6) {
      console.error("❌ Password too short.");
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    if (password !== confirmPassword) {
      console.error("❌ Passwords do not match.");
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // Find user by reset token (Ensure password field is retrieved)
    let user = await User.findOne({ resetPasswordToken: token })
      .select("+password")
      .session(session);

    if (!user) {
      console.error("❌ Invalid or expired token.");
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    console.log("✅ User found:", user.email);
    console.log("🔍 Token Expiry Time:", user.resetPasswordExpires);
    console.log("🔍 Current Time:", new Date());

    if (
      user.resetPasswordExpires &&
      new Date(user.resetPasswordExpires).getTime() < Date.now()
    ) {
      console.error("❌ Token has expired.");
      return res.status(401).json({
        error: "Token has expired. Please request a new password reset link.",
      });
    }

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      console.error("❌ New password cannot be the same as the old password.");
      return res.status(400).json({
        error: "New password cannot be the same as the old password.",
      });
    }

    console.log("✅ Token is valid. Proceeding to reset password...");

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔹 Old Hashed Password:", user.password);
    console.log("🔹 New Hashed Password:", hashedPassword);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save({ session, validateBeforeSave: false });

    await session.commitTransaction();
    session.endSession();

    console.log("✅ Password updated successfully!");

    // ✅ Send JSON Response Instead of Redirect
    return res
      .status(200)
      .json({ message: "Password reset successful! You can now log in." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Reset Password Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
});

// ✅ Email Verification Route with Redirect to Frontend Page
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Find user by verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/email-verification-failed.html`
      );
    }

    // ✅ Mark user as verified
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    // ✅ Redirect to success page after verification
    return res.redirect(
      `${process.env.CLIENT_URL}https://adarsh-holidays-backend-production.up.railway.app/authentication/verify-email.html`
    );
  } catch (err) {
    console.error("❌ Email Verification Error:", err);
    res.redirect(`${process.env.CLIENT_URL}/email-verification-failed.html`);
  }
});

// ✅ Check if Email Exists
router.get("/check-email", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    res.status(200).json({ message: "Email available" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Route to reset password
router.post("/reset-password/:token", resetPassword);
module.exports = router;
