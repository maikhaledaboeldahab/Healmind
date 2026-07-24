// const express = require("express");
// const router = express.Router();

// const {
//   getDashboardStats,
//   getAllDoctors,
//   getPendingDoctors,
//   getApprovedDoctors,
//   getDoctorById,
//   approveDoctor,
//   rejectDoctor,
//   getAllUsers,
//   activateUser,
//   deactivateUser,
//   deleteUser,
//   getAllPatients,
// } = require("../controllers/Admindashboard");

// const { protect, restrictTo } = require("../middleware/authMiddleware");

// // كل الـ Dashboard للأدمن فقط
// router.use(protect);
// router.use(restrictTo("admin"));

// // ================= Dashboard =================
// router.get("/stats", getDashboardStats);

// // ================= Doctors =================
// router.get("/doctors", getAllDoctors);
// router.get("/doctors/pending", getPendingDoctors);
// router.get("/doctors/approved", getApprovedDoctors);
// router.get("/doctors/:id", getDoctorById);

// router.patch("/doctors/:id/approve", approveDoctor);
// router.patch("/doctors/:id/reject", rejectDoctor);

// // ================= Users =================
// router.get("/users", getAllUsers);

// router.patch("/users/:id/activate", activateUser);
// router.patch("/users/:id/deactivate", deactivateUser);

// router.delete("/users/:id", deleteUser);

// // ================= Patients =================
// router.get("/patients", getAllPatients);

// module.exports = router;