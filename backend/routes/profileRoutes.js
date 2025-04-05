const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();
const uploadDir = path.join(__dirname, "../uploads/profile_pictures");
const DEFAULT_PROFILE_PICTURE = "default-user-profile-fallback-image.png";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Allow all common image formats including GIFs
    const filetypes = /jpeg|jpg|png|gif|webp|bmp|svg|tiff/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) return cb(null, true);
    cb(
      new Error(
        "Only image files are allowed (jpg, png, gif, webp, bmp, svg, tiff)"
      )
    );
  },
  limits: {
    fileSize: Infinity, // No size limit
  },
});

// Serve static files from the uploads folder
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Upload or Change Profile Picture
router.post(
  "/upload-profile-picture",
  authMiddleware,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ error: "User not found" });

      // Remove old profile picture if exists
      if (
        user.profilePicture &&
        user.profilePicture !== DEFAULT_PROFILE_PICTURE
      ) {
        const oldPath = path.join(uploadDir, user.profilePicture);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      user.profilePicture = req.file.filename;
      await user.save();
      res.json({
        success: true,
        message: "Profile picture uploaded",
        profilePicture: req.file.filename,
      });
    } catch (error) {
      res.status(500).json({ error: "Error uploading profile picture" });
    }
  }
);

// Remove Profile Picture
router.delete("/remove-profile-picture", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Remove current profile picture if it's not the default
    if (
      user.profilePicture &&
      user.profilePicture !== DEFAULT_PROFILE_PICTURE
    ) {
      const filePath = path.join(uploadDir, user.profilePicture);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    user.profilePicture = DEFAULT_PROFILE_PICTURE;
    await user.save();
    res.json({
      success: true,
      message: "Profile picture removed",
      profilePicture: DEFAULT_PROFILE_PICTURE,
    });
  } catch (error) {
    res.status(500).json({ error: "Error removing profile picture" });
  }
});

// Route to serve profile pictures
router.get("/profile_pictures/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(
    __dirname,
    "../uploads/profile_pictures",
    filename
  );

  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    // Serve a default fallback image if not found
    res.sendFile(
      path.join(
        __dirname,
        "../uploads/profile_pictures",
        "default-user-profile-fallback-image.png"
      )
    );
  }
});

module.exports = router;
