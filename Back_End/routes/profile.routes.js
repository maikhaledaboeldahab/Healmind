const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  updateDoctorProfile,
  updateProfileImage,
} = require("../controllers/Profile.controller");

const { protect, restrictTo } = require("../middleware/authMiddleware");

const { uploadProfileImage } = require("../middleware/uploadMiddleware");

// Get Profile
router.get("/", protect, getProfile);

// Update User Profile
router.put("/profile", protect, updateProfile);



// Update Profile Image
router.put(
  "/image",
  protect,
  uploadProfileImage,
  updateProfileImage
);

module.exports = router;