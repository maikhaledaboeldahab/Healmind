const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // مين هياخد الإشعار
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "recipientModel",
      required: true,
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ["patient", "doctor"], // نفس أسماء الموديلز المسجلة فعليًا في User.js
    },

    // نوع الإشعار (يفيدنا لو عايزين نفرق بينهم في الفرونت، أو نعمل فلترة)
    type: {
      type: String,
      required: true,
      enum: [
        "new_message",
        "session_booked",
        "session_status_changed",
        "session_rescheduled",
        "report_submitted",
      ],
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);