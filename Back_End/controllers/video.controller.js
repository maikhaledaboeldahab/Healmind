const Session = require("../models/session.model");
const { generateRoomName } = require("../utils/videoCallService");

// كام دقيقة قبل المعاد يُسمح بالدخول، وكام دقيقة بعده يُغلق الروم
// (المدة دي قابلة للتعديل بسهولة من هنا لو المشروع احتاج تغييرها)
const JOIN_WINDOW_BEFORE_MINUTES = 10;
const JOIN_WINDOW_AFTER_MINUTES = 60;

// GET /api/session/:id/video-call
// يرجع بيانات الدخول للفيديو كول (اسم الروم + الدومين) لو الوقت والصلاحية مناسبين
exports.getVideoCallRoom = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role; // "doctor" أو "patient"

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // ✅ تأكيد إن اليوزر الحالي طرف فعلي في السيشن دي (مش أي حد يعرف الـ ID)
    const isParticipant =
      (userRole === "doctor" && session.doctorId.toString() === userId) ||
      (userRole === "patient" && session.patientId.toString() === userId);

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this session",
      });
    }

    // ✅ السيشن لازم تكون من نوع video أصلاً
    if (session.mode !== "video") {
      return res.status(400).json({
        success: false,
        message: "This session is not a video call session",
      });
    }

    // ✅ السيشن لازم تكون متأكدة (مش pending أو cancelled)
    if (session.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: `Session must be confirmed to join the call. Current status: "${session.status}"`,
      });
    }

    // ✅ لازم يكون فيه معاد محدد للسيشن
    if (!session.scheduledTime) {
      return res.status(400).json({
        success: false,
        message: "This session has no scheduled time yet",
      });
    }

    // ✅ التحقق من التوقيت: مسموح بالدخول من X دقيقة قبل المعاد لحد Y دقيقة بعده
    const now = new Date();
    const scheduledTime = new Date(session.scheduledTime);
    const windowStart = new Date(scheduledTime.getTime() - JOIN_WINDOW_BEFORE_MINUTES * 60 * 1000);
    const windowEnd = new Date(scheduledTime.getTime() + JOIN_WINDOW_AFTER_MINUTES * 60 * 1000);

    if (now < windowStart) {
      return res.status(403).json({
        success: false,
        message: `The call is not open yet. It opens ${JOIN_WINDOW_BEFORE_MINUTES} minutes before the scheduled time.`,
        scheduledTime: session.scheduledTime,
      });
    }

    if (now > windowEnd) {
      return res.status(403).json({
        success: false,
        message: "The call window has expired.",
        scheduledTime: session.scheduledTime,
      });
    }

    // ✅ كل حاجة تمام، نولّد بيانات الروم
    const roomName = generateRoomName(session._id);

    return res.status(200).json({
      success: true,
      data: {
        roomName,
        jitsiDomain: "meet.jit.si",
        displayName: req.user.name,
      },
    });
  } catch (error) {
    console.error("❌ Error getting video call room:", error);
    return res.status(500).json({
      success: false,
      message: "Error getting video call room",
      error: error.message,
    });
  }
};