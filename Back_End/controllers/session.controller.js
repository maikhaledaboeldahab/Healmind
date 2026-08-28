const Session = require("../models/session.model");
const { Patient, Doctor } = require("../models/User");
const { createNotification } = require("../utils/notificationService");
const { createSessionSchema, updateSessionSchema, endSessionSchema, rescheduleSessionSchema } = require("../validation/session.validation");

//----------------------------------------normal Session-------------------------

// Role: patient
// المريض بيبعت طلب حجز بمعاد مقترح، والدكتور بعدين يأكد أو يرفض عن طريق updateSessionStatus
// exports.createSession = async (req, res) => {
//   try {
//     // Joi Validation
//     // ملحوظة: لو أسامي الفيلدز في createSessionSchema مختلفة عن اللي هنا، ظبطها حسب الـ schema بتاعتك
//     const { error, value } = createSessionSchema.validate(req.body, {
//       abortEarly: false,
//       stripUnknown: true,
//     });

//     if (error) {
//       return res.status(400).json({
//         success: false,
//         errors: error.details.map((err) => err.message),
//       });
//     }

//     const { doctorId, type, mode, scheduledTime, location } = value;

//     // ✅ لو الحجز بالكشف الفعلي، لازم يكون فيه عنوان
//     if (mode === "visit" && (!location || !location.address)) {
//       return res.status(400).json({
//         success: false,
//         message: "Location address is required when mode is 'visit'",
//       });
//     }

//     // تأكيد إن الدكتور موجود فعلاً وموافق عليه
//     const doctor = await Doctor.findById(doctorId);
//     if (!doctor) {
//       return res.status(404).json({
//         success: false,
//         message: "Doctor not found",
//       });
//     }

//     if (!doctor.isApproved) {
//       return res.status(400).json({
//         success: false,
//         message: "This doctor is not approved yet",
//       });
//     }

//     const patient = await Patient.findById(req.user.id);

//     const basePrice = doctor.sessionPrice || 0;
//     const finalAmount = basePrice * 0.20;
//     const balance = basePrice - finalAmount;
//     const isBalancePrepaid = basePrice <= finalAmount;

//     const session = await Session.create({
//       patientId: patient._id,
//       doctorId: doctor._id,
//       patientname: patient.name,
//       doctorname: doctor.name,
//       type,
//       mode,
//       scheduledTime,
//       location: mode === "visit" ? location : undefined,
//       status: "pending",
//       sessionPrice: basePrice,
//       depositAmount: finalAmount,
//       balance: balance,
//       depositPaid: false,
//       balancePaid: isBalancePrepaid,
//     });

//     // ✅ نبلغ الدكتور إن فيه طلب حجز جديد محتاج تأكيده
//     const io = req.app.get("io");
//     await createNotification(io, {
//       recipientId: doctor._id,
//       recipientModel: "doctor",
//       type: "session_booked",
//       title: "New Session Request",
//       message: `${patient.name} has requested a new session with you`,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Session request created successfully. Waiting for doctor confirmation.",
//       data: session,
//     });
//   } catch (error) {
//     console.error("❌ Error creating session:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error creating session",
//       error: error.message,
//     });
//   }
// };

//get all sessions
// Admin role
exports.getAllSessions = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin resources only."
      });
    }

    const sessions = await Session.find()
      .sort({ scheduledTime: 1 })
      // Optional: Populate doctor and patient names for the admin dashboard
      .populate('doctorId', 'name email')
      .populate('patientId', 'name email');
    return res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }

}
// Helper function to auto-expire pending sessions older than 7 days
async function cleanupExpiredSessions() {
  try {
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS);

    const expiredSessions = await Session.find({
      status: 'pending',
      balancePaid: { $ne: true },
      createdAt: { $lt: sevenDaysAgo },
    });

    for (const s of expiredSessions) {
      s.status = 'cancelled';
      await s.save();
      if (s.doctorId && s.slotId) {
        await Doctor.updateOne(
          { _id: s.doctorId, 'slots._id': s.slotId },
          { $set: { 'slots.$.isBooked': false } }
        );
      }
    }
  } catch (err) {
    console.error('Error cleaning up expired sessions:', err.message);
  }
}

// Doctor and patient
//may filter by status, date range, and type
exports.getMySessions = async (req, res) => {
  try {
    await cleanupExpiredSessions();

    const userId = req.user.id;
    const { status, startDate, endDate, type } = req.query;

    let query = {};

    if (req.user.role === 'doctor') {
      query.doctorId = userId;
    } else if (req.user.role === 'patient') {
      query.patientId = userId;
    }

    // Apply Filters
    if (status) query.status = status;
    if (type) query.type = type;

    // Date Range Filtering (scheduledTime)
    if (startDate || endDate) {
      query.scheduledTime = {};
      if (startDate) query.scheduledTime.$gte = new Date(startDate);
      if (endDate) query.scheduledTime.$lte = new Date(endDate);
    }

    // Fetch full session objects with populated patient and doctor details
    const sessions = await Session.find(query)
      .populate('patientId', 'name email phone gender dateOfBirth')
      .populate('doctorId', 'name email specialization sessionPrice profileImage')
      .sort({ scheduledTime: -1 });

    return res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
      data: sessions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching sessions",
      error: error.message,
    });
  }
};


// Doctor and patient and admin
exports.getSessionDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const sessionId = req.params.sessionid;

    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid session ID format.",
      });
    }

    let query = {};

    if (userRole === "doctor") {
      query.doctorId = userId;
    } else if (userRole === "patient") {
      query.patientId = userId;
    } else if (userRole === "admin") {
      query = {};
    } else {
      // Failsafe in case a user without a valid role hits this route
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Invalid user role.",
      });
    }

    const session = await Session.findOne({
      _id: sessionId,
      ...query
    })
      .populate('patientId', 'name email phone gender dateOfBirth profileImage')
      .populate('doctorId', 'name email specialization sessionPrice profileImage');

    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};


//Role : doctor
exports.updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    //validation
    const { error } = updateSessionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const validStatuses = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
      "rejected",
    ];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const session = await Session.findOne({ _id: req.params.id, doctorId: req.user.id });

    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    if (status === "confirmed") {
      if (!session.depositPaid) {
        return res.status(400).json({
          success: false,
          message: "Cannot confirm session until deposit payment is completed."
        });
      }

      // Mark the doctor's slot as unavailable/booked
      if (session.slotId) {
        await Doctor.updateOne(
          { _id: session.doctorId, "slots._id": session.slotId },
          { $set: { "slots.$.isBooked": true } }
        );
        console.log(`Slot ${session.slotId} for Doctor ${session.doctorId} marked as booked/unavailable upon confirmation.`);
      }
    }

    session.status = status;
    await session.save();

    // ✅ نبلغ المريض إن حالة السيشن اتغيرت
    const io = req.app.get("io");
    await createNotification(io, {
      recipientId: session.patientId,
      recipientModel: "patient",
      type: "session_status_changed",
      title: "Session Status Updated",
      message: `Your session with Dr. ${session.doctorname} has been updated to "${status}"`,
    });

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating status",
        error: error.message,
      });
  }
};

//Role : doctor
exports.submitVisitReport = async (req, res) => {
  try {

    //validation
    const { error, value } = updateSessionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const { diagnosis, notes, followUpDate, prescription } = value;
    // 1. Verify session exists by session id
    // 2. Create Report
    // do a report db first
    //this will go to report database but initially I will save it in an object
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, doctorId: req.user.id },
      {
        prescription,
        report: {
          Diagnosis: diagnosis,
          Notes: notes,
          Followup_recommendation: followUpDate,
        },
        status: "completed",
      },
      { new: true },
    );

    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    // ✅ نبلغ المريض إن التقرير والروشتة جاهزين
    const io = req.app.get("io");
    await createNotification(io, {
      recipientId: session.patientId,
      recipientModel: "patient",
      type: "report_submitted",
      title: "New Report Available",
      message: `Dr. ${session.doctorname} has submitted your session report and prescription`,
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Report submitted successfully",
        report: session.report,
        prescription: prescription,
        status: session.status,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error submitting report",
        error: error.message,
      });
  }
};

//reschedule
exports.rescheduleSession = async (req, res) => {
  try {
    const { newScheduledTime } = req.body;
    //validation
    const { error } = rescheduleSessionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, doctorId: req.user.id },
      { scheduledTime: newScheduledTime, status: "rescheduled" },
      { new: true },
    );
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    // ✅ نبلغ المريض إن الميعاد اتغيّر
    const io = req.app.get("io");
    await createNotification(io, {
      recipientId: session.patientId,
      recipientModel: "patient",
      type: "session_rescheduled",
      title: "Session Rescheduled",
      message: `Dr. ${session.doctorname} has rescheduled your session`,
    });

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error rescheduling session", error: error.message });
  }
};


//----------------------------------------end of Doctor related APIs-------------------------