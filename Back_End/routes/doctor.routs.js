const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfileImage,

} = require("../controllers/Profile.controller");

const { updateDoctorProfile, getPatientHistory, setSlots, getSlots, deleteSlots, cancelSlot } = require("../controllers/doctor.controller");

const { protect, restrictTo } = require("../middleware/authMiddleware");

const { uploadProfileImage } = require("../middleware/uploadMiddleware");

// Get Profile
router.get("/", protect, getProfile);

// Update Doctor Profile
router.patch("/", protect, restrictTo("doctor"), updateDoctorProfile);

// Update Profile Image
router.put("/image", protect, uploadProfileImage, updateProfileImage);

// Get Patient History
router.get("/patient/history/:id", protect, restrictTo("doctor"), getPatientHistory);

//slots
router.post("/slots", protect, restrictTo("doctor"), setSlots);
router.get("/slots", protect, restrictTo("doctor"), getSlots);
router.delete("/slots", protect, restrictTo("doctor"), deleteSlots);
router.delete("/slots/:id", protect, restrictTo("doctor"), cancelSlot);

module.exports = router;
