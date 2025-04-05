const { body, validationResult } = require("express-validator");

// 🟢 Registration Validation Middleware
const validateRegistration = [
  body("fullname")
    .trim()
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 2 }).withMessage("Full name must be at least 2 characters long"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

// 🟢 Login Validation Middleware
const validateLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .trim()
    .notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateRegistration, validateLogin };
