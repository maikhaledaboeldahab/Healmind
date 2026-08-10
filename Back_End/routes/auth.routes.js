const express = require("express");
const router = express.Router();

// ===================== Controllers =====================
const {
  registerPatient,
  registerDoctor,
  login,
  refreshToken,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.Controller");

// ===================== Middleware =====================
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { uploadCertificate } = require("../middleware/uploadMiddleware");

// ===================== Validation =====================
const {
  validate,
  loginSchema,
} = require("../validation/User.validators");

const {
  registerPatientSchema,
} = require("../validation/Patient.validators");

const {
  registerDoctorSchema,
} = require("../validation/Doctor.validators");


const {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validation/authValidators");


// ======================================================
// Public Routes
// ======================================================


// Register Patient
router.post(
  "/register/patient",
  validate(registerPatientSchema),
  registerPatient
);

// Register Doctor
router.post(
  "/register/doctor",
  uploadCertificate,
  validate(registerDoctorSchema),
  registerDoctor
);



// Login
router.post(
  "/login",
  validate(loginSchema),
  login
);

// Refresh Token
router.post(
  "/refresh-token",
  refreshToken
);

// Forgot Password
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPassword
);

// Reset Password
router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  resetPassword
);

// ======================================================
// Protected Routes
// ======================================================

// Logout
router.post(
  "/logout",
  protect,
  logout
);

// Change Password
router.patch(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePassword
);

module.exports = router;