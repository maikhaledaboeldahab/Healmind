const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getVideoCallRoom } = require("../controllers/video.controller");

router.use(protect);

router.get("/:id/video-call", getVideoCallRoom);

module.exports = router;