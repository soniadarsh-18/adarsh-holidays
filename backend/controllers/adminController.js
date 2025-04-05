const User = require("../models/User");

// ✅ Get Dashboard Statistics
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        res.status(200).json({ totalUsers });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Error fetching dashboard stats" });
    }
};

// ✅ Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

// ✅ Add New User
const addUser = async (req, res) => {
    res.status(200).json({ message: "Add user API working" });
};

// ✅ Update User Details
const updateUser = async (req, res) => {
    res.status(200).json({ message: "Update user API working" });
};

// ✅ Delete User
const deleteUser = async (req, res) => {
    res.status(200).json({ message: "Delete user API working" });
};

// ✅ Add New Package
const addPackage = async (req, res) => {
    res.status(200).json({ message: "Add package API working" });
};



module.exports = { getDashboardStats, getAllUsers, addUser, updateUser, deleteUser, addPackage };
