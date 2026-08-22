const Notification = require("../models/Notification.model");

// GET /api/notifications
// يرجع كل إشعارات اليوزر الحالي، الأحدث أولًا
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
    }).sort({ createdAt: -1 });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

// PATCH /api/notifications/:id/read
// يعلّم إشعار واحد كمقروء
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id }, // تأكيد إنه إشعار اليوزر ده فعلاً
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating notification",
      error: error.message,
    });
  }
};

// PATCH /api/notifications/read-all
// يعلّم كل الإشعارات كمقروءة دفعة واحدة
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating notifications",
      error: error.message,
    });
  }
};