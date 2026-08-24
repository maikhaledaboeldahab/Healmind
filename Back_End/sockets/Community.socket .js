// =============================================
// 🌐 Community Socket Handlers (Posts & Comments)
// =============================================
// ⚠️ IMPORTANT: this file does NOT add its own io.use() auth middleware.
// The single auth middleware already registered in chat.socket.js runs
// for EVERY connecting socket (it's attached to the shared `io` instance),
// so by the time any 'connection' listener fires — whether from
// chat.socket.js or this file — socket.user / socket.userId / socket.role
// are already set. Adding a second io.use() here would just run auth
// twice and risk conflicting logic.
//
// This file only ADDS more event listeners on top of the same sockets
// chat.socket.js already authenticated.

module.exports = (io) => {
  io.on("connection", (socket) => {
    // socket.user / socket.userId / socket.role were already set by the
    // auth middleware in chat.socket.js before this handler ever runs.

    // ℹ️ ملحوظة: مفيش هنا أي تحقق من communityAccess. الـ socket بيدير
    // بس الغرف ومؤشرات الكتابة — مفيش أي "كتابة" فعلية بتحصل من جواه.
    // كل الكتابة الحقيقية (بوست/كومنت) بتعدي على REST وبتتحقق هناك
    // من requireCommunityAccess middleware. فكل المرضى — approved أو
    // pending — بينضموا لغرفة community ويستقبلوا التحديثات لايف،
    // حتى لو لسه مش مسموحلهم يكتبوا.

    // Every connected user auto-joins the main feed room, so they receive
    // newPost / postUpdated / postDeleted / postLiked / commentCountUpdated
    socket.join("community");

    // =============================================
    // 📌 Join / Leave a specific post's room
    // (needed to receive newComment / commentDeleted for that post only)
    // =============================================
    socket.on("joinPost", (postId) => {
      if (!postId) return;
      socket.join(`post:${postId}`);
    });

    socket.on("leavePost", (postId) => {
      if (!postId) return;
      socket.leave(`post:${postId}`);
    });

    // =============================================
    // ⌨️ Typing indicator while writing a comment
    // payload: { postId }
    // =============================================
    socket.on("typingComment", (data) => {
      const postId = data?.postId;
      if (!postId) return;
      socket.to(`post:${postId}`).emit("userTypingComment", {
        postId,
        userId: socket.userId,
        name: socket.user.name,
      });
    });

    socket.on("stopTypingComment", (data) => {
      const postId = data?.postId;
      if (!postId) return;
      socket.to(`post:${postId}`).emit("userStopTypingComment", {
        postId,
        userId: socket.userId,
      });
    });

    // Note: we intentionally do NOT add another 'disconnect' listener for
    // online/offline presence here — chat.socket.js already broadcasts
    // 'user_offline' globally on disconnect. Adding a second presence
    // system here would just create two competing sources of truth.
  });
};
