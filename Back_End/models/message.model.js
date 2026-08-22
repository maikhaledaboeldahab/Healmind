const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },

  // المرسل
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'senderModel',
    required: true
  },
  senderModel: {
    type: String,
    required: true,
    // ✅ لازم تكون نفس اسم الموديل المسجل فعليًا في User.js
    // (User.discriminator("patient", ...) و User.discriminator("doctor", ...))
    enum: ['patient', 'doctor']
  },

  // المستقبل
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'receiverModel',
    required: true
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ['patient', 'doctor']
  },

  message: {
    type: String,
    required: true,
    trim: true
  },

  // الحالات
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,

  // موجودة في chat.socket.js بس كانت ناقصة من الـ schema
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date,
  isDeletedForEveryone: {
    type: Boolean,
    default: false
  },
  deletedBy: [{
    type: mongoose.Schema.Types.ObjectId
  }]

}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);