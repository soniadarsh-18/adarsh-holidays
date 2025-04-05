const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

dotenv.config();
const app = express();

// ✅ Allow CORS from Frontend (VS Code Live Server & React)
const allowedOrigins = [
  "http://localhost:5500",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5000",
  "http://127.0.0.1:5501",
  "https://adarshholidayss.netlify.app" //
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS Blocked:", origin);
        callback(new Error("CORS Policy Error: Not Allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "x-reset-token",
    ],
    credentials: true,
  })
);

// ✅ Middleware to Parse Requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Handle Preflight Requests
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    return res.status(204).send();
  }
  next();
});

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
connectDB();

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminRoutes = require("./routes/adminRoutes");
const flightRoutes = require("./routes/flightRoutes");
const trainRoutes = require("./routes/trainRoutes");


// ✅ Debugging Middleware to Log Incoming Requests
app.use((req, res, next) => {
  console.log(`📢 [${req.method}] ${req.path}`);
  console.log("🔹 Headers:", req.headers);
  console.log("🔹 Body:", req.body);
  next();
});

// ✅ Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/payment", require("./routes/paymentRoutes"));


// ✅ Handle 404 Errors
app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res
    .status(500)
    .json({ error: "Internal server error. Please try again later." });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// ✅ Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

// ✅ Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

app.use(
  "/uploads/profile_pictures",
  express.static(path.join(__dirname, "uploads/profile_pictures"))
);

app.get("/", (req, res) => {
  res.send("Backend is Live 🚀");
});
