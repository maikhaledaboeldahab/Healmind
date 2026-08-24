// ⚠️ ده مش ملف جديد بديل عن session.routes.js بتاعك
// ده بس السطر المطلوب تضيفه في ملفك الحالي، مكانه فوق أي route فيه :id
// (عشان Express يقرا الـ static routes قبل الـ dynamic ones لو فيه تعارض)

const express = require("express");
const router = express.Router();

const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  createSession, // ✅ الدالة الجديدة
  getAllSessions,
  getMySessions,
  getSessionDetails,
  updateSessionStatus,
  submitVisitReport,
  rescheduleSession,
} = require("../controllers/session.controller");

router.use(protect);

// ✅ الراوت الجديد المطلوب إضافته
// router.post("/", protect, restrictTo("patient"), createSession);

// باقي الراوتس بتاعتك زي ما هي (مثال تقريبي حسب الدوال الموجودة)
router.get("/", getAllSessions);
router.get("/my-sessions", getMySessions);
router.get("/getMySessions", getMySessions);
router.get("/getmysessions", getMySessions);
router.get("/:sessionid", getSessionDetails);
router.patch("/:id", restrictTo("doctor"), updateSessionStatus);
router.post("/:id/report", restrictTo("doctor"), submitVisitReport);
router.patch("/:id/reschedule", restrictTo("doctor"), rescheduleSession);

module.exports = router;