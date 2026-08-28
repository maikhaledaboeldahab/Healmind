const Notification = require("../models/Notification.model");
const { Patient, Doctor } = require("../models/User");

/**
 * ✅ الدالة دي الوحيدة اللي أي جزء في النظام (الشات، السيشن...) محتاج يناديها
 * لإرسال إشعار لمستخدم معين.
 *
 * بتعمل حاجتين:
 * 1) تسجل الإشعار في الداتابيز (عشان يفضل موجود حتى لو اليوزر أوفلاين)
 * 2) لو اليوزر أونلاين (عنده socketId)، تبعتله فورًا عن طريق socket.io
 *
 * @param {Object} io - instance بتاع socket.io (لازم نمررها من app.js)
 * @param {String} recipientId - ID المستخدم المستقبل
 * @param {String} recipientModel - "patient" أو "doctor"
 * @param {String} type - نوع الإشعار (لازم يكون من الـ enum بتاع الموديل)
 * @param {String} title - عنوان مختصر
 * @param {String} message - تفاصيل الإشعار
 */
const createNotification = async (io, { recipientId, recipientModel, type, title, message, senderId, senderName }) => {
  try {
    // 1) نسجل الإشعار في الداتابيز
    const notification = await Notification.create({
      recipient: recipientId,
      recipientModel,
      type,
      title,
      message,
    });

    // 2) نتأكد هل المستقبل أونلاين ولا لأ، ونبعتله فورًا لو أونلاين
    const Model = recipientModel === "patient" ? Patient : Doctor;
    const recipientUser = await Model.findById(recipientId).select("socketId");

    if (recipientUser && recipientUser.socketId) {
      io.to(recipientUser.socketId).emit("new_notification", {
        _id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        senderId,
        senderName,
      });
    }

    return notification;
  } catch (error) {
    // مهم: خطأ في الإشعار مايكسرش العملية الأساسية (زي إرسال الرسالة نفسها)
    // فبنسجل الخطأ في الـ console بس ومنعملش throw
    console.error("❌ Error creating notification:", error.message);
    return null;
  }
};

module.exports = { createNotification };