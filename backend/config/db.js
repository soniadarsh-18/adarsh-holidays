const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Suppress Mongoose warnings
mongoose.set("strictQuery", false);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "adarsh-holidays", // ✅ Ensures correct database is used
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true, // ✅ Ensures indexes are created for faster queries
            serverSelectionTimeoutMS: 10000, // ✅ Increased timeout to 10 seconds
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host} | Database: ${conn.connection.name}`);
    } catch (err) {
        console.error(`❌ MongoDB Connection Error: ${err.message}`);

        // Prevents immediate crash, allows for retry attempts
        console.log("🔄 Retrying connection in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
};

// Handle MongoDB connection errors
mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Connection Error:", err);
});

// Graceful shutdown on server termination
process.on("SIGINT", async () => {
    console.log("⚠️ Closing MongoDB connection...");
    await mongoose.connection.close();
    console.log("✅ MongoDB Disconnected. Exiting process...");
    process.exit(0);
});

module.exports = connectDB;
