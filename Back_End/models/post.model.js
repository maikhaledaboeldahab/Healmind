const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post must have an author."],
    },

    content: {
      type: String,
      required: [true, "Post content is required."],
      trim: true,
      maxlength: [2000, "Post content must not exceed 2000 characters."],
    },

    attachments: {
      type: [String], // image/file URLs
      default: [],
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    commentsCount: {
      type: Number,
      default: 0,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Helpful for feed pagination (latest first, pinned first)
postSchema.index({ isPinned: -1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;