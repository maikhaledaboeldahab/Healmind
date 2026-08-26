// routes/communityAccess.routes.js

const express = require("express");
const router = express.Router();

const {
  getPendingPatients,
  decideCommunityAccess,
} = require("../controllers/communityAccess.controller");

const { protect, restrictTo } = require("../middleware/authMiddleware");

router.use(protect);
router.use(restrictTo("doctor"));

router.get("/pending", getPendingPatients);
router.patch("/:patientId", decideCommunityAccess);

module.exports = router;

// في server.js أو app.js ضيفي:
// app.use("/api/doctor/community-access", require("./routes/communityAccess.routes"));
