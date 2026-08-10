const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfileImage,

} = require("../controllers/Profile.controller");

const { updateDoctorProfile, getPatientHistory, setSlots, getSlots, deleteAllSlots, deleteSlot, editSlot } = require("../controllers/doctor.controller");

const { protect, restrictTo } = require("../middleware/authMiddleware");

const { uploadProfileImage } = require("../middleware/uploadMiddleware");

// Get Profile
router.get("/", protect, getProfile);

// Update Doctor Profile
router.patch("/", protect, restrictTo("doctor"), updateDoctorProfile);

// Update Profile Image
router.put("/image", protect, uploadProfileImage, updateProfileImage);

// Get Patient History
router.get("/patient/history/:id", protect, restrictTo("doctor"), getPatientHistory);         //added and tested by Mai
// router.get("/patient/profile/:id", protect,restrictTo("doctor"),istheresessionbetweenyou,getpatientprofile) //later and needs to generate token while making a session

//slots
router.post("/slots", protect, restrictTo("doctor"), setSlots);         //added and tested by Mai
router.get("/slots", protect, restrictTo("doctor"), getSlots);          //added and tested by Mai
router.delete("/slots", protect, restrictTo("doctor"), deleteAllSlots);          //added and tested by Mai
router.delete("/slots/:id", protect, restrictTo("doctor"), deleteSlot);         //added and tested by Mai
router.patch("/slots/:id", protect, restrictTo("doctor"), editSlot);         //added and tested by Mai

module.exports = router;
