// routes/communityAccess.routes.js

const express = require("express");
const router = express.Router();

const {
  getPendingPatients,
  decideCommunityAccess,
} = require("../controllers/communityAccess.controller");

// ⚠️ عدّلي المسار/الاسم لو مختلف عندك
const { protect } = require("../middleware/authMiddleware");
// ⚠️ لو عندك middleware بيتحقق من الـ role (زي restrictTo("doctor"))، ضيفيه هنا كمان

router.use(protect);

router.get("/pending", getPendingPatients);
router.patch("/:patientId", decideCommunityAccess);

module.exports = router;

// في server.js أو app.js ضيفي:
// app.use("/api/doctor/community-access", require("./routes/communityAccess.routes"));
