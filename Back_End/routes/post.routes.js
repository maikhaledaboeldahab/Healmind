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

router.use(protect); // every route below requires a logged-in user

// Nested route: /api/posts/:postId/comments -> handled by comment.routes.js
router.use("/:postId/comments", commentRouter);

router.route("/").get(getFeed).post(createPost);

router.route("/:id").get(getPostById).patch(updatePost).delete(deletePost);

router.post("/:id/like", toggleLike);

module.exports = router;