const express = require("express");

const {
  approveDoctor,
  rejectDoctor,
  getPendingDoctors,
  getApprovedDoctors,
  getAllDoctors,
  getDoctorById,
  getAllUsers,
  getAllPatients,
  activateUser,
  deactivateUser,
  deleteUser,
  deletePatient,
} = require("../controllers/Admin.controller");

const {
  protect,
  restrictTo,
  superAdminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// // ======================================================
// // DEBUG - مؤقتًا فقط
// // ======================================================

// console.log("protect:", typeof protect);
// console.log("restrictTo:", typeof restrictTo);
// console.log("superAdminOnly:", typeof superAdminOnly);

// console.log("approveDoctor:", typeof approveDoctor);
// console.log("rejectDoctor:", typeof rejectDoctor);
// console.log("getPendingDoctors:", typeof getPendingDoctors);
// console.log("getApprovedDoctors:", typeof getApprovedDoctors);
// console.log("getAllDoctors:", typeof getAllDoctors);
// console.log("getDoctorById:", typeof getDoctorById);
// console.log("getAllUsers:", typeof getAllUsers);
// console.log("getAllPatients:", typeof getAllPatients);
// console.log("activateUser:", typeof activateUser);
// console.log("deactivateUser:", typeof deactivateUser);
// console.log("deleteUser:", typeof deleteUser);
// console.log("deletePatient:", typeof deletePatient);

// ======================================================
// DOCTORS
// ======================================================

router.get(
  "/doctors/pending",
  protect,
  restrictTo("admin"),
  getPendingDoctors
);

router.get(
  "/doctors/approved",
  protect,
  restrictTo("admin"),
  getApprovedDoctors
);

router.get(
  "/doctors",
  protect,
  restrictTo("admin"),
  getAllDoctors
);

router.get(
  "/doctors/:id",
  protect,
  restrictTo("admin"),
  getDoctorById
);

router.patch(
  "/doctors/:id/approve",
  protect,
  restrictTo("admin"),
  approveDoctor
);

router.patch(
  "/doctors/:id/reject",
  protect,
  restrictTo("admin"),
  rejectDoctor
);

// ======================================================
// USERS
// ======================================================

router.get(
  "/users",
  protect,
  restrictTo("admin"),
  getAllUsers
);

router.patch(
  "/users/:id/activate",
  protect,
  restrictTo("admin"),
  activateUser
);

router.patch(
  "/users/:id/deactivate",
  protect,
  restrictTo("admin"),
  deactivateUser
);

// Super Admin only
router.delete(
  "/users/:id",
  protect,
  superAdminOnly,
  deleteUser
);

// ======================================================
// PATIENTS
// ======================================================

router.get(
  "/patients",
  protect,
  restrictTo("admin"),
  getAllPatients
);

// Super Admin only
router.delete(
  "/patients/:id",
  protect,
  superAdminOnly,
  deletePatient
);

module.exports = router;