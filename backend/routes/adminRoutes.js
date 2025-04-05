const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// ✅ Route for getting dashboard stats
router.get("/dashboard", adminController.getDashboardStats);

// ✅ Route for getting all users
router.get("/users", adminController.getAllUsers);

// ✅ Route for adding a user
router.post("/users", adminController.addUser);

// ✅ Route for updating a user
router.put("/users/:id", adminController.updateUser);

// ✅ Route for deleting a user
router.delete("/users/:id", adminController.deleteUser);

// ✅ Route for adding a package
router.post("/packages", adminController.addPackage);

module.exports = router;
