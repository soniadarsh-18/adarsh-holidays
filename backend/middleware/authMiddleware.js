const jwt = require("jsonwebtoken");
const User = require("../models/User");

const ensureAuthToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    // ✅ Extract Bearer Token or fallback to cookies
    if (token?.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    } else {
      token = req.cookies?.token || null;
    }

    // ✅ Log token details only if present
    if (token) {
      console.log("📢 Checking Authentication...");
      console.log("🔑 Extracted Token:", token);
    }

    // ✅ No token found
    if (!token) {
      console.error("❌ Access Denied: No token provided.");
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    // ✅ Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // ✅ Ensure the token contains userId
    if (!decoded?.userId) {
      throw new Error("Invalid token structure.");
    }

    // ✅ Fetch User from Database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.error("❌ Authentication Failed: User not found.");
      return res
        .status(401)
        .json({ error: "User not found. Please log in again." });
    }

    // ✅ Attach user to request object
    req.user = user;
    console.log("✅ User Authenticated:", req.user.email);

    next();
  } catch (error) {
    console.error(`❌ Authentication Failed: ${error.message}`);

    return res.status(401).json({
      error:
        error.name === "TokenExpiredError"
          ? "Session expired. Please log in again."
          : "Invalid token. Please log in again.",
    });
  }
};


exports.protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token is found, return an error
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID and exclude the password field
    req.user = await User.findById(decoded.id).select("-password");

    // If the user is not found, return an error
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Attach the user to the request object and proceed
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token expired" });
    }

    // Handle other errors
    res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Invalid token. User not found." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

const multer = require("multer");

// Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile_pictures/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File Type Validation (Allow any image format)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only image files are allowed"), false); // Reject the file
  }
};

// Upload Middleware
const upload = multer({
  storage: storage, // Define your storage configuration elsewhere
  fileFilter: fileFilter, // Apply the file filter
  limits: { fileSize: 100 * 1024 * 1024 }, // Set file size limit to 100MB
});

module.exports = upload;

module.exports = verifyToken;
module.exports = ensureAuthToken;
exports.protect = ensureAuthToken;
