const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const { Patient, Doctor } = require("../models/User");

// GET /api/conversations
// يرجع كل المحادثات الخاصة باليوزر الحالي (دكتور أو مريض) مرتبة بالأحدث
exports.getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role; // "patient" أو "doctor" (بحروف صغيرة زي الموديل المسجل)

    const conversations = await Conversation.find({
      "participants.user": userId,
    })
      .sort({ lastMessageAt: -1 })
      .populate("participants.user", "name email profileImage");

    const result = conversations.map((conv) => {
      const other = conv.participants.find(
        (p) => p.user && p.user._id.toString() !== userId
      );

      return {
        conversationId: conv._id,
        otherUser: other ? other.user : null,
        otherUserRole: other ? other.role : null,
        lastMessageText: conv.lastMessageText,
        lastMessageAt: conv.lastMessageAt,
        unreadCount: conv.unreadCount ? conv.unreadCount[userRole] || 0 : 0,
      };
    });

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("❌ Error fetching conversations (REST):", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching conversations",
      error: error.message,
    });
  }
};

// GET /api/conversations/:conversationId/messages
// يرجع كل رسايل محادثة معينة (اختياري، مفيد للتيست)
exports.getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // تأكيد إن اليوزر الحالي طرف في المحادثة دي فعلاً
    const conversation = await Conversation.findOne({
      _id: conversationId,
      "participants.user": userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or you don't have access to it.",
      });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "name email")
      .populate("receiver", "name email");

    // ✅ نفس منطق الـ "mark as read" اللي كان في socket event get_chat_history القديم
    // بنعلّم الرسايل اللي وصلت لليوزر الحالي كمقروءة، ونبلغ المرسل لو أونلاين
    const unreadMessages = messages.filter(
      (msg) => msg.receiver._id.toString() === userId && !msg.isRead
    );

    if (unreadMessages.length > 0) {
      const unreadIds = unreadMessages.map((m) => m._id);
      await Message.updateMany(
        { _id: { $in: unreadIds } },
        { isRead: true, readAt: new Date() }
      );

      conversation.unreadCount[req.user.role] = 0;
      await conversation.save();

      // نبلغ كل مرسل (لو أونلاين) إن رسايله اتقرت
      const io = req.app.get("io");
      const senderIds = [...new Set(unreadMessages.map((m) => m.sender._id.toString()))];

      for (const senderId of senderIds) {
        const readMessages = unreadMessages.filter(
          (m) => m.sender._id.toString() === senderId
        );
        const senderModel = readMessages[0].senderModel; // "patient" أو "doctor"
        const Model = senderModel === "patient" ? Patient : Doctor;
        const sender = await Model.findById(senderId).select("socketId");

        if (sender && sender.socketId) {
          io.to(sender.socketId).emit("messages_seen_bulk", {
            messageIds: readMessages.map((m) => m._id),
            receiverId: userId,
            seenAt: new Date(),
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("❌ Error fetching conversation messages (REST):", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching messages",
      error: error.message,
    });
  }
};