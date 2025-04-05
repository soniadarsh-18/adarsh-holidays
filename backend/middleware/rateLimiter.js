const rateLimit = require("express-rate-limit");

// 🛡️ Rate Limiter Middleware (Limits Login & Register Attempts)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per window (for register/login)
    message: { success: false, message: "Too many requests, please try again later." },
    headers: true,
});

module.exports = limiter;
