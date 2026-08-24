const express = require("express");
const router = express.Router();

const {
  createPost,
  getFeed,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
} = require("../controllers/post.controller");

const commentRouter = require("./Comment.routes");

// ⚠️ Adjust to match your existing auth middleware import/name
const { protect } = require("../middleware/authMiddleware");
const requireCommunityAccess = require("../middleware/communityAccess");

router.use(protect); // every route below requires a logged-in user

// Nested route: /api/posts/:postId/comments -> handled by comment.routes.js
router.use("/:postId/comments", commentRouter);

// القراءة (GET) متاحة للكل من غير شرط الموافقة — عشان المريض يقدر
// على الأقل يشوف الفيد وهو مستني موافقة الدكتور
router.get("/", getFeed);
router.get("/:id", getPostById);

// الكتابة (POST/PATCH/DELETE/like) محتاجة موافقة الدكتور لو المستخدم patient
router.post("/", requireCommunityAccess, createPost);
router.patch("/:id", requireCommunityAccess, updatePost);
router.delete("/:id", requireCommunityAccess, deletePost);
router.post("/:id/like", requireCommunityAccess, toggleLike);

module.exports = router;
