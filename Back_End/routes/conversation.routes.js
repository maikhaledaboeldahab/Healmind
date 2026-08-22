const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getMyConversations,
  getConversationMessages,
} = require("../controllers/conversation.controller");

// كل الـ routes دي محتاجة اليوزر يكون مسجل دخول (protect)
router.use(protect);

// GET /api/conversations
router.get("/", getMyConversations);

// GET /api/conversations/:conversationId/messages
router.get("/:conversationId/messages", getConversationMessages);

module.exports = router;