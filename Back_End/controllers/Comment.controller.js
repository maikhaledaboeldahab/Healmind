const Post = require("../models/post.model");
const Comment = require("../models/Comment.model");
const asyncHandler = require("../middleware/asyncHandler");
// io is retrieved per-request from req.app.get("io") — see server.js (app.set("io", io))

/**
 * @desc    Add a comment to a post
 * @route   POST /api/posts/:postId/comments
 * @access  Private
 */
exports.addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content, parentComment } = req.body;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found." });
  }

  const comment = await Comment.create({
    post: postId,
    author: req.user._id,
    content,
    parentComment: parentComment || null,
  });

  post.commentsCount += 1;
  await post.save();

  const populatedComment = await comment.populate("author", "name role profileImage");

  // 🔴 Only clients viewing this specific post's detail page get this event
  req.app.get("io").to(`post:${postId}`).emit("newComment", populatedComment);

  // Optional: also nudge the feed so the comment counter updates live there too
  req.app.get("io").to("community").emit("commentCountUpdated", {
    postId,
    commentsCount: post.commentsCount,
  });

  res.status(201).json({
    success: true,
    message: "Comment added successfully.",
    data: populatedComment,
  });
});

/**
 * @desc    Get all comments for a post (threaded-ready, flat response)
 * @route   GET /api/posts/:postId/comments
 * @access  Private
 */
exports.getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: 1 })
    .populate("author", "name role profileImage");

  res.status(200).json({ success: true, data: comments });
});

/**
 * @desc    Delete own comment (or admin)
 * @route   DELETE /api/comments/:id
 * @access  Private (author or admin)
 */
exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({ success: false, message: "Comment not found." });
  }

  const isOwner = comment.author.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to delete this comment.",
    });
  }

  const { post: postId } = comment;
  await comment.deleteOne();

  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } });

  req.app.get("io").to(`post:${postId}`).emit("commentDeleted", { commentId: comment._id });

  res.status(200).json({ success: true, message: "Comment deleted successfully." });
});