const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const generateOTP = require("../utils/generateOTP");
const sendSMS = require("../utils/sendSMS");
const multer = require("multer");
const path = require("path");

// ✅ Update User Profile (Excluding Email & Restricting Mobile Update)
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      fullName,
      birthday,
      gender,
      maritalStatus,
      address,
      pincode,
      state,
      mobileNumber,
    } = req.body;

    // ✅ Find User
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Prevent Email Updates
    if (req.body.email && req.body.email !== user.email) {
      return res.status(400).json({ message: "Email cannot be updated" });
    }

    // ✅ Restrict Mobile Update (Only if not updated before)
    if (mobileNumber && user.mobileNumber !== mobileNumber) {
      if (user.mobileNumberUpdated) {
        return res
          .status(400)
          .json({ message: "Mobile number can only be updated once" });
      }
      user.mobileNumber = mobileNumber;
      user.mobileNumberUpdated = true;
    }

    // ✅ Update Other Profile Fields
    user.fullName = fullName || user.fullName;
    user.birthday = birthday || user.birthday;
    user.gender = gender || user.gender;
    user.maritalStatus = maritalStatus || user.maritalStatus;
    user.address = address || user.address;
    user.pincode = pincode || user.pincode;
    user.state = state || user.state;

    // ✅ Save Updates
    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("❌ Profile Update Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Change Password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from JWT Token
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // ✅ Validate Inputs
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // ✅ Check if New Password & Confirm Password Match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirm password do not match." });
    }

    // ✅ Find the user in DB
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    // ✅ Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Incorrect old password." });

    // ✅ Hash New Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // ✅ Update Password in Database
    user.password = hashedPassword;
    await user.save();

    console.log("✅ Password Changed Successfully");

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    console.error("❌ Change Password Error:", err);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
};

// ✅ Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/user/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Please click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    res.status(500).json({ message: "Email could not be sent" });
  }
};

// ✅ Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword)
      return res
        .status(400)
        .json({ error: "Both password fields are required" });
    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match" });

    const user = await User.findOne({ resetPasswordToken: token });

    if (!user || Date.now() > user.resetPasswordExpire) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.json({
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Add Co-Traveler
exports.addCoTraveler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, age, relation } = req.body;
    if (!name || !age || !relation) {
      return res
        .status(400)
        .json({ message: "All co-traveler fields are required" });
    }

    user.coTravelers.push({ name, age, relation });
    await user.save();

    res.status(200).json({
      message: "Co-traveler added successfully",
      coTravelers: user.coTravelers,
    });
  } catch (error) {
    console.error("❌ Add Co-Traveler Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Remove Co-Traveler
exports.removeCoTraveler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { travelerId } = req.params;
    user.coTravelers = user.coTravelers.filter(
      (traveler) => traveler._id.toString() !== travelerId
    );
    await user.save();

    res.status(200).json({
      message: "Co-traveler removed successfully",
      coTravelers: user.coTravelers,
    });
  } catch (error) {
    console.error("❌ Remove Co-Traveler Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error("❌ Get Profile Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Update Profile Controller
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Extracted from authMiddleware
    const { profilePicture, birthday, gender, ...updates } = req.body; // Extracting specific fields

    // ✅ Fetch the current user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Ensure email is never updated
    delete updates.email;

    // ✅ Handle mobile number update (only via verifyMobile API)
    delete updates.mobileNumber;

    // ✅ Handle profile picture update
    if (profilePicture) {
      user.profilePicture = profilePicture;
    }

    // ✅ Handle birthday update (convert to Date)
    if (birthday) {
      user.birthday = new Date(birthday); // Ensure valid date format
    }

    // ✅ Handle gender update (only allowed values)
    if (gender && ["Male", "Female", "Other"].includes(gender)) {
      user.gender = gender;
    }

    // ✅ Update other allowed fields
    Object.assign(user, updates);

    // ✅ Save updated user
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.addCoTraveler = async (req, res) => {
  try {
    const userId = req.user.id; // Extract from JWT
    const { name, age, relation } = req.body;

    // ✅ Validate Inputs
    if (!name || !age || !relation) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // ✅ Find User
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    // ✅ Create New Co-Traveler Entry
    const newCoTraveler = {
      _id: new mongoose.Types.ObjectId(), // ✅ Generate unique _id
      name,
      age,
      relation,
    };

    // ✅ Add to User's Co-Travelers List
    user.coTravelers.push(newCoTraveler);
    await user.save();

    console.log("✅ Co-Traveler Added:", newCoTraveler);

    res.status(201).json({
      success: true,
      message: "Co-traveler added successfully.",
      coTravelers: user.coTravelers,
    });
  } catch (err) {
    console.error("❌ Add Co-Traveler Error:", err);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
};

exports.removeCoTraveler = async (req, res) => {
  try {
    const userId = req.user.id; // Extract from JWT
    const { coTravelerId } = req.body; // ID of co-traveler to remove

    if (!coTravelerId) {
      return res.status(400).json({ error: "Co-traveler ID is required." });
    }

    // ✅ Find User
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    // ✅ Filter Out Co-Traveler
    const updatedCoTravelers = user.coTravelers.filter(
      (traveler) => traveler._id.toString() !== coTravelerId
    );

    // ✅ Check If Any Co-Traveler Was Removed
    if (updatedCoTravelers.length === user.coTravelers.length) {
      return res.status(404).json({ error: "Co-traveler not found." });
    }

    // ✅ Update User Data
    user.coTravelers = updatedCoTravelers;
    await user.save();

    console.log("✅ Co-Traveler Removed:", coTravelerId);

    res.status(200).json({
      success: true,
      message: "Co-traveler removed successfully.",
      coTravelers: user.coTravelers,
    });
  } catch (err) {
    console.error("❌ Remove Co-Traveler Error:", err);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
};

exports.getCoTravelers = async (req, res) => {
  try {
    const userId = req.user.id; // Extract from JWT

    // ✅ Find User
    const user = await User.findById(userId).select("coTravelers");
    if (!user) return res.status(404).json({ error: "User not found." });

    res.status(200).json({
      success: true,
      coTravelers: user.coTravelers,
    });
  } catch (err) {
    console.error("❌ Get Co-Travelers Error:", err);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
};

exports.updateCoTraveler = async (req, res) => {
  try {
    const userId = req.user.id; // Extract from JWT
    const { coTravelerId, name, age, relation } = req.body;

    // ✅ Validate Inputs
    if (!coTravelerId || !name || !age || !relation) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // ✅ Find User
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    // ✅ Find the Co-Traveler in User's List
    const coTravelerIndex = user.coTravelers.findIndex(
      (traveler) => traveler._id.toString() === coTravelerId
    );

    if (coTravelerIndex === -1) {
      return res.status(404).json({ error: "Co-traveler not found." });
    }

    // ✅ Update Co-Traveler Details
    user.coTravelers[coTravelerIndex].name = name;
    user.coTravelers[coTravelerIndex].age = age;
    user.coTravelers[coTravelerIndex].relation = relation;

    // ✅ Save Updated User Data
    await user.save();

    console.log("✅ Co-Traveler Updated:", user.coTravelers[coTravelerIndex]);

    res.status(200).json({
      success: true,
      message: "Co-traveler updated successfully.",
      coTravelers: user.coTravelers,
    });
  } catch (err) {
    console.error("❌ Update Co-Traveler Error:", err);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
};

// ✅ 1. Send OTP for Mobile Update
// exports.updateMobile = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { newMobileNumber } = req.body;

//     // ✅ Check if user already updated mobile once
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     if (user.mobileNumberUpdated) {
//       return res
//         .status(400)
//         .json({ error: "Mobile number update is allowed only once." });
//     }

//     // ✅ Generate OTP
//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

//     // ✅ Save OTP and temp mobile number in the database
//     user.otp = otp;
//     user.otpExpiry = otpExpiry;
//     user.tempMobileNumber = newMobileNumber; // ✅ Store the new number
//     await user.save();

//     // ✅ Send OTP via SMS
//     await sendSMS(newMobileNumber, `Your OTP is: ${otp}`);

//     res.json({ success: true, message: "OTP sent to your new mobile number." });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// };

// ✅ Update Mobile Number (without OTP)
exports.updateMobile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { newMobileNumber } = req.body;

    // ✅ Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Check if user already updated mobile once
    if (user.mobileNumberUpdated) {
      return res
        .status(400)
        .json({ error: "Mobile number update is allowed only once." });
    }

    // ✅ Validate the new mobile number
    if (!/^\d{10}$/.test(newMobileNumber)) {
      return res.status(400).json({
        error: "Invalid mobile number. Please enter a 10-digit number.",
      });
    }

    // ✅ Update the mobile number permanently
    user.mobileNumber = newMobileNumber;
    user.mobileNumberUpdated = true; // Mark as updated
    await user.save();

    res.json({ success: true, message: "Mobile number updated successfully." });
  } catch (error) {
    console.error("Error in updateMobile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ 2. Verify OTP and Update Mobile Number
exports.verifyMobile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otp } = req.body;

    // ✅ Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Validate OTP
    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    // ✅ Ensure tempMobileNumber exists before updating
    if (!user.tempMobileNumber) {
      return res.status(400).json({ error: "No mobile number to update." });
    }

    // ✅ Move tempMobileNumber to mobileNumber and mark as updated
    user.mobileNumber = user.tempMobileNumber;
    user.mobileNumberUpdated = true;

    // ✅ Clear OTP and temp fields
    user.otp = null;
    user.otpExpiry = null;
    user.tempMobileNumber = null; // ✅ Remove temp number after update

    await user.save();

    res.json({ success: true, message: "Mobile number updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// 🔹 Send OTP for Login
exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // 🔹 Send OTP using Firebase (or any other service)
    const session = await admin
      .auth()
      .createSessionCookie(phone, { expiresIn: 60000 });

    res.json({ success: true, message: "OTP sent successfully", session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Verify OTP & Login
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res.status(400).json({ message: "Phone and OTP are required" });

    // 🔹 Verify OTP using Firebase
    const decodedToken = await admin.auth().verifyIdToken(otp);
    if (!decodedToken) return res.status(401).json({ message: "Invalid OTP" });

    // 🔹 Check if user exists
    let user = await User.findOne({ mobileNumber: phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔹 Generate JWT token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ success: true, message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile_pictures"); // Store in 'uploads/profile_pictures' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });
// ✅ Upload Profile Picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Delete old profile picture if it exists and is not the default
    if (user.profilePicture && user.profilePicture !== "default.jpg") {
      const oldImagePath = path.join(
        __dirname,
        "../uploads/profile_pictures",
        user.profilePicture
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Save new profile picture
    user.profilePicture = req.file.filename;
    await user.save();

    // Return the full updated user profile with the correct profile picture URL
    res.json({
      success: true,
      message: "Profile picture updated successfully",
      user: {
        ...user._doc, // Spread all user data
        profilePicture: `${process.env.BASE_URL}/uploads/profile_pictures/${user.profilePicture}`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Remove Profile Picture
exports.removeProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Delete existing profile picture if it's not the default
    if (user.profilePicture && user.profilePicture !== "default.jpg") {
      const imagePath = path.join(
        __dirname,
        "../uploads/profile_pictures",
        user.profilePicture
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Reset to default image
    user.profilePicture = "default.jpg";
    await user.save();

    res.json({
      success: true,
      message: "Profile picture removed",
      profilePicture: `${process.env.BASE_URL}/uploads/profile_pictures/default.jpg`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Profile Picture
exports.getProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const profilePicPath = `${process.env.BASE_URL}/uploads/profile_pictures/${
      user.profilePicture || "default.jpg"
    }`;

    res.json({
      success: true,
      profilePicture: profilePicPath,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a co-traveler
exports.updateCoTraveler = async (req, res) => {
  try {
    const { coTravelerId, name, age, relation } = req.body;

    if (!coTravelerId || !name || !age || !relation) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(req.user.id);
    const traveler = user.coTravelers.find(
      (traveler) => traveler._id.toString() === coTravelerId
    );

    if (!traveler) {
      return res.status(404).json({ message: "Co-traveler not found" });
    }

    traveler.name = name;
    traveler.age = age;
    traveler.relation = relation;

    await user.save();
    res.json({
      message: "Co-traveler updated successfully",
      coTravelers: user.coTravelers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Admin Panel

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isVerified: true });
    const totalBookings = await Booking.countDocuments();
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const flightBookings = await Booking.countDocuments({ type: "flight" });
    const busBookings = await Booking.countDocuments({ type: "bus" });
    const trainBookings = await Booking.countDocuments({ type: "train" });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalBookings,
        flightBookings,
        busBookings,
        trainBookings,
      },
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add new user
exports.addUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if the email is the predefined admin email
    const role = email === "adarshholidayss@gmail.com" ? "admin" : "user";

    const newUser = new User({ fullName, email, password, role });
    await newUser.save();

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedData = req.body;
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add package
exports.addPackage = async (req, res) => {
  try {
    const newPackage = new Package(req.body);
    await newPackage.save();
    res.status(201).json({ success: true, package: newPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports.upload = upload;

// Get user settings
exports.getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user settings
exports.updateUserSettings = async (req, res) => {
  try {
    const { disableLoginEmails, country } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.settings.disableLoginEmails = disableLoginEmails;
    user.settings.country = country;
    await user.save();

    res.json({ message: "Settings updated successfully", settings: user.settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};