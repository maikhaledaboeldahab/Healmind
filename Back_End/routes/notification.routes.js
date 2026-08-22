const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notification.controller");

router.use(protect);

router.get("/", getMyNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);

module.exports = router;