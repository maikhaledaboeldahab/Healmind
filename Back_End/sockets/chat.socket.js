const jwt = require('jsonwebtoken');
const { Patient, Doctor } = require('../models/User');
const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');
const { createNotification } = require('../utils/notificationService');

// =============================================
// 🔧 Helper function to find user by role
// =============================================
const findUserByRole = async (id, role) => {
  if (role === 'patient') {
    return await Patient.findById(id);
  } else if (role === 'doctor') {
    return await Doctor.findById(id);
  }
  return null;
};

// =============================================
// 🔧 Helper: يتأكد إن الـ payload راجع كـ object
// (بعض العملاء زي Postman ممكن يبعتوا الـ payload كـ JSON string)
// =============================================
const parsePayload = (data) => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return data;
};

module.exports = (io) => {
  // =============================================
  // 🔐 Socket.IO Authentication Middleware
  // =============================================
  io.use(async (socket, next) => {
    try {
      // Get token from auth handshake
      // ملحوظة: بنقرأ التوكن من مكانين عشان نغطي الحالتين
      // (Postman بيبعتها غالبًا في socket.handshake.auth.token)
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.auth;

      console.log(' Socket Auth: Token received:', token ? ' Yes' : ' No');

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return next(new Error('Token expired. Please login again'));
        }
        return next(new Error('Invalid token'));
      }

      console.log('📦 Decoded:', decoded);

      // Find user by role
      const userId = decoded.id || decoded.userId;
      const user = await findUserByRole(userId, decoded.role);

      if (!user) {
        console.log('❌ User not found:', userId);
        return next(new Error('User not found'));
      }

      if (!user.isActive) {
        return next(new Error('Account is deactivated'));
      }

      console.log(`✅ User found: ${user.name} (${decoded.role})`);

      // Attach user data to socket
      socket.user = user;
      socket.userId = user._id.toString();
      socket.role = decoded.role;

      next();
    } catch (error) {
      console.error('❌ Socket Auth Error:', error);
      next(new Error('Authentication failed: ' + error.message));
    }
  });

  // =============================================
  // 📡 Connection Handler
  // =============================================
  io.on('connection', async (socket) => {
    try {
      console.log(`✅ ${socket.role} connected: ${socket.user.name} (${socket.userId})`);

      // Save socketId with try-catch
      try {
        socket.user.socketId = socket.id;
        await socket.user.save();
        console.log("the socket id is ", socket.user.socketId);
        console.log(`💾 SocketId saved for ${socket.user.name}`);
      } catch (err) {
        console.error('❌ Error saving socketId:', err);
      }

      // =============================================
      // 1️⃣ Send Message
      // =============================================
      socket.on('send_message', async (data) => {
        try {
          data = parsePayload(data);
          if (!data) {
            return socket.emit('error', {
              message: 'Invalid message format, expected JSON object',
              code: 'INVALID_PAYLOAD'
            });
          }

          // ✅ توحيد لحروف صغيرة زي أسماء الموديلز الحقيقية المسجلة في User.js
          // (User.discriminator("patient", ...) و User.discriminator("doctor", ...))
          const { receiverId, message } = data;
          const receiverModel = (data.receiverModel || '').toLowerCase();

          console.log(`📩 ${socket.user.name} is sending: "${message}"`);
          console.log(receiverId);

          if (!['patient', 'doctor'].includes(receiverModel)) {
            return socket.emit('error', {
              message: 'receiverModel must be "patient" or "doctor"',
              code: 'INVALID_RECEIVER_MODEL'
            });
          }

          // Get receiver
          const receiver = await findUserByRole(receiverId, receiverModel);

          if (!receiver) {
            console.log(`❌ Receiver not found: ${receiverId}`);
            socket.emit('error', {
              message: 'Receiver not found',
              code: 'RECEIVER_NOT_FOUND'
            });
            return;
          }

          console.log(`✅ Receiver found: ${receiver.name}`);

          // Find or create conversation
          // ✅ استخدام $elemMatch عشان نتأكد إن الشرطين بيتطابقوا على نفس الـ participant
          let conversation = await Conversation.findOne({
            $and: [
              {
                participants: {
                  $elemMatch: { user: socket.userId, model: socket.role }
                }
              },
              {
                participants: {
                  $elemMatch: { user: receiverId, model: receiverModel }
                }
              }
            ]
          });

          // Create new conversation if not exists
          if (!conversation) {
            conversation = new Conversation({
              participants: [
                { user: socket.userId, model: socket.role, role: socket.role },
                { user: receiverId, model: receiverModel, role: receiverModel }
              ]
            });
            await conversation.save();
            console.log(`🆕 New conversation created: ${conversation._id}`);
          }

          // Save message
          const newMessage = new Message({
            conversationId: conversation._id,
            sender: socket.userId,
            senderModel: socket.role,
            receiver: receiverId,
            receiverModel: receiverModel,
            message: message,
            isRead: false
          });

          await newMessage.save();
          console.log(`💾 Message saved: ${newMessage._id}`);

          // Update conversation
          conversation.lastMessage = newMessage._id;
          conversation.lastMessageText = message;
          conversation.lastMessageAt = new Date();

          conversation.unreadCount[receiverModel] = (conversation.unreadCount[receiverModel] || 0) + 1;
          await conversation.save();

          // Prepare message data
          const messageData = {
            messageId: newMessage._id,
            conversationId: conversation._id,
            senderId: socket.userId,
            senderName: socket.user.name,
            senderRole: socket.role,
            message: message,
            timestamp: newMessage.createdAt,
            isRead: false
          };

          // Send confirmation to sender
          socket.emit('message_sent', {
            success: true,
            messageId: newMessage._id,
            conversationId: conversation._id,
            timestamp: newMessage.createdAt
          });

          console.log("receiver id ", receiver.socketId);
          // Send to receiver if online
          if (receiver.socketId) {
            console.log(`📨 Sending to receiver: ${receiver.name}`);
            io.to(receiver.socketId).emit('receive_message', messageData);

            // Update delivery status
            newMessage.isDelivered = true;
            newMessage.deliveredAt = new Date();
            await newMessage.save();

            socket.emit('message_delivered', {
              messageId: newMessage._id,
              deliveredAt: newMessage.deliveredAt
            });
          } else {
            console.log(`⏳ Receiver offline: ${receiver.name}`);
            socket.emit('message_sent_offline', {
              messageId: newMessage._id,
              note: 'Receiver is offline. Message will be delivered when they connect'
            });
          }

          // ✅ الإشعار بيتسجل ويتبعت دايمًا (أونلاين أو أوفلاين)
          // القرار إنه يتعرض للمستخدم كـ toast أو لأ بيبقى مسؤولية الفرونت
          // (مثلاً: لو الفرونت شايف إن اليوزر فاتح نفس المحادثة دي بالفعل، يقدر يتجاهل الـ toast)
          await createNotification(io, {
            recipientId: receiverId,
            recipientModel: receiverModel,
            type: 'new_message',
            title: 'New Message',
            message: `${socket.user.name} sent you a new message`,
          });

        } catch (error) {
          console.error('❌ Error sending message:', error);
          socket.emit('error', {
            message: 'Failed to send message',
            code: 'SEND_MESSAGE_FAILED',
            details: error.message
          });
        }
      });

      // =============================================
      // 2️⃣ Mark Message as Read (Seen)
      // =============================================
      socket.on('mark_as_read', async (data) => {
        try {
          data = parsePayload(data);
          if (!data) {
            return socket.emit('error', { message: 'Invalid payload', code: 'INVALID_PAYLOAD' });
          }
          const { messageId } = data;

          const message = await Message.findById(messageId);
          if (!message) {
            socket.emit('error', {
              message: 'Message not found',
              code: 'MESSAGE_NOT_FOUND'
            });
            return;
          }

          // Check if current user is the receiver
          if (message.receiver.toString() !== socket.userId) {
            socket.emit('error', {
              message: 'You are not the receiver of this message',
              code: 'NOT_AUTHORIZED'
            });
            return;
          }

          // Update message status
          message.isRead = true;
          message.readAt = new Date();
          await message.save();

          // Update unread count
          const conversation = await Conversation.findById(message.conversationId);
          if (conversation) {
            conversation.unreadCount[socket.role] = Math.max(0, (conversation.unreadCount[socket.role] || 0) - 1);
            await conversation.save();
          }

          // Notify sender
          const sender = await findUserByRole(message.sender, message.senderModel);

          if (sender && sender.socketId) {
            io.to(sender.socketId).emit('message_seen', {
              messageId: messageId,
              receiverId: socket.userId,
              receiverName: socket.user.name,
              seenAt: message.readAt
            });
          }

          // Confirm to reader
          socket.emit('read_confirmation', {
            messageId: messageId,
            readAt: message.readAt,
            success: true
          });

        } catch (error) {
          console.error('❌ Error updating read status:', error);
          socket.emit('error', {
            message: 'Failed to update read status',
            code: 'UPDATE_READ_FAILED',
            details: error.message
          });
        }
      });

      
      // =============================================
      // 3️⃣ Delete Message
      // =============================================
      socket.on('delete_message', async (data) => {
        try {
          data = parsePayload(data);
          if (!data) {
            return socket.emit('error', { message: 'Invalid payload', code: 'INVALID_PAYLOAD' });
          }
          const { messageId, forEveryone = false } = data;

          const message = await Message.findById(messageId);
          if (!message) {
            socket.emit('error', {
              message: 'Message not found',
              code: 'MESSAGE_NOT_FOUND'
            });
            return;
          }

          // Check if user is the sender
          if (message.sender.toString() !== socket.userId) {
            socket.emit('error', {
              message: 'You can only delete your own messages',
              code: 'NOT_AUTHORIZED'
            });
            return;
          }

          if (forEveryone) {
            // Delete for everyone
            message.isDeletedForEveryone = true;
            await message.save();

            // Notify all participants
            const conversation = await Conversation.findById(message.conversationId);
            if (conversation) {
              for (const participant of conversation.participants) {
                const user = await findUserByRole(participant.user, participant.model);

                if (user && user.socketId) {
                  io.to(user.socketId).emit('message_deleted', {
                    messageId: messageId,
                    deletedBy: socket.userId,
                    deletedFor: 'everyone'
                  });
                }
              }
            }
          } else {
            // Delete for me only
            await Message.findByIdAndUpdate(messageId, {
              $addToSet: { deletedBy: socket.userId }
            });

            socket.emit('message_deleted', {
              messageId: messageId,
              deletedBy: socket.userId,
              deletedFor: 'me'
            });
          }

        } catch (error) {
          console.error('❌ Error deleting message:', error);
          socket.emit('error', {
            message: 'Failed to delete message',
            code: 'DELETE_MESSAGE_FAILED',
            details: error.message
          });
        }
      });

      // =============================================
      // 4️⃣ Typing Indicator
      // =============================================
      socket.on('typing', async (data) => {
        try {
          data = parsePayload(data);
          if (!data) return;
          // ✅ اتصلح: كنا بنستخدم role بتاع الـ sender بدل الـ receiver
          const { receiverId, isTyping } = data;
          const receiverModel = (data.receiverModel || '').toLowerCase();

          const receiver = await findUserByRole(receiverId, receiverModel);

          if (receiver && receiver.socketId) {
            io.to(receiver.socketId).emit('typing_status', {
              userId: socket.userId,
              userName: socket.user.name,
              isTyping: isTyping
            });
          }

        } catch (error) {
          console.error('❌ Error in typing indicator:', error);
        }
      });

      // =============================================
      // 📌 Disconnect Handler
      // =============================================
      socket.on('disconnect', async () => {
        try {
          console.log(`❌ ${socket.role} disconnected: ${socket.user.name}`);
          socket.user.socketId = null;
          await socket.user.save();

          // Notify others that user went offline
          socket.broadcast.emit('user_offline', {
            userId: socket.userId,
            name: socket.user.name,
            lastSeen: new Date()
          });
        } catch (error) {
          console.error('❌ Error in disconnect:', error);
        }
      });

      // =============================================
      // 🛑 General Error Handler
      // =============================================
      socket.on('error', (error) => {
        console.error(`❌ Socket Error (${socket.userId}):`, error);
      });

    } catch (error) {
      console.error('❌ Connection Error:', error);
      socket.disconnect();
    }
  });
};