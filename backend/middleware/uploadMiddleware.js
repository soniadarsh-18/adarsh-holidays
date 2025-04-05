const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/uploads/profile_pictures/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max file size
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (JPG, PNG) are allowed"));
    }
  },
});

module.exports = upload;
