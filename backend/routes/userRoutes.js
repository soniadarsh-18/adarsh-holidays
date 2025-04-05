const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");
const {
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  updateProfile,
  updateMobile,
  verifyMobile,
  addCoTraveler,
  removeCoTraveler,
  getCoTravelers,
  updateCoTraveler,
  sendOtp,
  verifyOtp,
  getProfilePicture,
  uploadProfilePicture,
  removeProfilePicture,
  upload,
  getUserSettings, 
  updateUserSettings,
} = require("../controllers/userController");
const userController = require("../controllers/userController");
const multer = require("multer");
const path = require("path");
const router = express.Router();


// ✅ Rate Limiting for Forgot/Reset Password
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: "Too many password reset attempts. Try again later." },
});

// ✅ Protected Routes
router.patch("/profile", authMiddleware, updateUserProfile);
router.post("/change-password", authMiddleware, changePassword);

// ✅ Rate Limited Password Reset Routes
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password/:token", passwordResetLimiter, resetPassword);
// ✅ Update User Profile Route
router.put("/update", authMiddleware, userController.updateProfile);
router.post("/co-travelers/add", authMiddleware, userController.addCoTraveler);
router.delete(
  "/co-travelers/remove",
  authMiddleware,
  userController.removeCoTraveler
);
router.get("/co-travelers", authMiddleware, userController.getCoTravelers);

// Update a co-traveler
router.put("/co-traveler/update", authMiddleware, updateCoTraveler);

// ✅ Request OTP for mobile update
router.post("/update-mobile", authMiddleware, updateMobile);

// ✅ Verify OTP and update mobile
router.post("/verify-mobile", authMiddleware, verifyMobile);

// Send OTP for login
router.post("/send-otp", sendOtp); // Use only sendOtp function
// Verify OTP and login
router.post("/verify-otp", authMiddleware, verifyOtp);

// Get user settings
router.get("/settings/:userId", getUserSettings);

// Update user settings
router.put("/settings/:userId", updateUserSettings);



// ✅ Fetch User Dashboard (Use authMiddleware to simplify token handling)
// router.get("/dashboard", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found." });

//     console.log("✅ User Dashboard Data Fetched:", user);

//     res.status(200).json({
//       message: "User Dashboard Loaded",
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         role: user.role,
//         profilePicture: user.profilePicture || null,
//         bookings: user.bookings || [],
//       },
//     });
//   } catch (err) {
//     console.error("❌ Dashboard Error:", err);
//     res
//       .status(500)
//       .json({ message: "Internal server error. Please try again." });
//   }
// });

// ✅ Update User Profile (Using authMiddleware instead of manually verifying token)
router.put("/profile/update", authMiddleware, async (req, res) => {
  try {
    const { fullName, profilePicture } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, profilePicture },
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found." });

    console.log("✅ Profile Updated:", updatedUser);

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Profile Update Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again." });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Define profile picture URL (Use user's image or fallback)
    const profilePictureUrl = user.profilePicture
      ? `${req.protocol}://${req.get("host")}/uploads/profile_pictures/${
          user.profilePicture
        }`
      : `${req.protocol}://${req.get(
          "host"
        )}/uploads/profile_pictures/default-user-profile-fallback-image.png`;

    // Send user data with updated profile picture URL
    res.json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: profilePictureUrl, // Full URL of profile picture
        birthday: user.birthday,
        gender: user.gender,
        maritalStatus: user.maritalStatus,
        address: user.address,
        pincode: user.pincode,
        state: user.state,
        mobileNumber: user.mobileNumber,
        coTravelers: user.coTravelers,
        bookings: user.bookings,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
