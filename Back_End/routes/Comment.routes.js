const express = require("express");
const router = express.Router({ mergeParams: true }); // needed to read :postId from parent router

const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/Comment.controller");

// ⚠️ Adjust to match your existing auth middleware import/name
const { protect } = require("../middleware/authMiddleware");
const requireCommunityAccess = require("../middleware/communityAccess");

router.use(protect);

router.get("/", getComments); // القراءة متاحة للكل
router.post("/", requireCommunityAccess, addComment);
router.delete("/:id", requireCommunityAccess, deleteComment);

module.exports = router;
