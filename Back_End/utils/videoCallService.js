const crypto = require("crypto");

/**
 * ✅ بيولّد اسم روم فريد لكل سيشن، مشتق من الـ sessionId + secret بتاع السيرفر
 *
 * ليه مش بنستخدم sessionId مباشرة كاسم الروم؟
 * لأن sessionId ظاهر أصلاً في الـ URL وفي أي مكان تاني في النظام،
 * فلو استخدمناه زي ما هو، أي حد يعرف رقم سيشن (حتى لو مش طرف فيها)
 * هيقدر يدخل نفس الروم في meet.jit.si لأنها مفتوحة لأي حد يعرف الاسم.
 *
 * الحل: بنعمل HMAC (hash موقّع بمفتاح سري) للـ sessionId، فيطلع اسم
 * غير قابل للتخمين أو الاشتقاق إلا لو حد عنده الـ secret بتاع السيرفر نفسه.
 */
const generateRoomName = (sessionId) => {
  const secret = process.env.JITSI_ROOM_SECRET || process.env.JWT_SECRET;

  const hash = crypto
    .createHmac("sha256", secret)
    .update(sessionId.toString())
    .digest("hex")
    .substring(0, 20);

  return `healmind-${hash}`;
};

module.exports = { generateRoomName };