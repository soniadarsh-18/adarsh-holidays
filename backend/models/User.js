const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      immutable: true,
    }, // ⛔ Cannot be updated
    password: { type: String, required: true },
    profilePicture: {
      type: String,
      default:
        "/backend/uploads/profile_pictures/default-user-profile-fallback-image.png",
    },
    // ✅ Mobile Number (Can update only once)
    mobileNumber: { type: String, unique: true, sparse: true },
    mobileNumberUpdated: { type: Boolean, default: false },
    // ✅ Temporary Mobile Number (For OTP Verification)
    tempMobileNumber: { type: String }, // ✅ Added this field

    // ✅ OTP Fields
    otp: { type: String },
    otpExpiry: { type: Date },

    // ✅ Profile Details
    birthday: { type: Date, default: null },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    address: { type: String },
    pincode: { type: String },
    state: { type: String },
    settings: {
      disableLoginEmails: { type: Boolean, default: false },
      country: { type: String, default: "" }
    },

    loggedInDevices: [
      {
        deviceType: String,
        location: String,
        loggedInSince: Date,
      },
    ],

    profileCompletion: { type: Number, default: 70 },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    role: { type: String, enum: ["user", "admin"], default: "user" },
    profilePicture: { type: String, default: "" },

    // ✅ Co-Travelers (Stored as objects instead of references)
    coTravelers: [
      {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        relation: { type: String, required: true },
      },
    ],

    // ✅ Reference to Flight Bookings (Only store ObjectIds)
    flightBookings: [{ type: String, ref: "FlightBooking" }],


  },
  { timestamps: true }
);

const coTravelerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  relation: { type: String, required: true },
});

// ✅ Indexing for Performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ mobileNumber: 1 }, { unique: true, sparse: true });
userSchema.index({ "bookings.externalBookingId": 1 });

module.exports = mongoose.model("User", userSchema);
