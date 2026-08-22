const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  // المشاركون
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'participants.model',
      required: true
    },
    model: {
      type: String,
      required: true,
      // ✅ لازم تكون نفس اسم الموديل المسجل فعليًا في User.js
      enum: ['patient', 'doctor']
    },
    role: {
      type: String,
      enum: ['patient', 'doctor'],
      required: true
    }
  }],

  // آخر رسالة
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageText: String,
  lastMessageAt: {
    type: Date,
    default: Date.now
  },

  // عدد الرسائل غير المقروءة
  unreadCount: {
    patient: { type: Number, default: 0 },
    doctor: { type: Number, default: 0 }
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Conversation', conversationSchema);