const express = require("express");
const router = express.Router({ mergeParams: true }); // needed to read :postId from parent router

const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/Comment.controller");

// ⚠️ Adjust to match your existing auth middleware import/name
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getComments).post(addComment);

router.delete("/:id", deleteComment);

module.exports = router;