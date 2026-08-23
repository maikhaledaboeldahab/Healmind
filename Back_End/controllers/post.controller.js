const Post = require("../models/post.model");
const Comment = require("../models/Comment.model");
const asyncHandler = require("../middleware/asyncHandler");




exports.createPost = asyncHandler(async (req, res) => {
  const { content, attachments } = req.body;

  const post = await Post.create({
    author: req.user._id, // set by your `protect` auth middleware
    content,
    attachments,
  });

  const populatedPost = await post.populate("author", "name role profileImage");

  // 🔴 Real-time broadcast to everyone viewing the community feed
  req.app.get("io").to("community").emit("newPost", populatedPost);

  res.status(201).json({
    success: true,
    message: "Post created successfully.",
    data: populatedPost,
  });
});

/**
 * @desc    Get paginated feed (latest first, pinned posts on top)
 * @route   GET /api/posts?page=1&limit=10
 * @access  Private
 */
exports.getFeed = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find()
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name role profileImage"),
    Post.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Get a single post by id
 * @route   GET /api/posts/:id
 * @access  Private
 */
exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "name role profileImage"
  );

  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found." });
  }

  res.status(200).json({ success: true, data: post });
});

/**
 * @desc    Update own post
 * @route   PATCH /api/posts/:id
 * @access  Private (author only)
 */
exports.updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found." });
  }

  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to edit this post.",
    });
  }

  post.content = req.body.content ?? post.content;
  post.attachments = req.body.attachments ?? post.attachments;
  post.isEdited = true;
  await post.save();

  const populatedPost = await post.populate("author", "name role profileImage");

  req.app.get("io").to("community").emit("postUpdated", populatedPost);

  res.status(200).json({ success: true, data: populatedPost });
});

/**
 * @desc    Delete own post (or admin)
 * @route   DELETE /api/posts/:id
 * @access  Private (author or admin)
 */
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found." });
  }

  const isOwner = post.author.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to delete this post.",
    });
  }

  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();

  req.app.get("io").to("community").emit("postDeleted", { postId: post._id });

  res.status(200).json({ success: true, message: "Post deleted successfully." });
});

/**
 * @desc    Toggle like on a post
 * @route   POST /api/posts/:id/like
 * @access  Private
 */
exports.toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found." });
  }

  const userId = req.user._id.toString();
  const alreadyLiked = post.likes.some((id) => id.toString() === userId);

  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();

  req.app.get("io").to("community").emit("postLiked", {
    postId: post._id,
    likesCount: post.likes.length,
    likedBy: req.user._id,
    liked: !alreadyLiked,
  });

  res.status(200).json({
    success: true,
    data: { likesCount: post.likes.length, liked: !alreadyLiked },
  });
});