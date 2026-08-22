const Session = require("../models/session.model");
const { Patient, Doctor } = require("../models/User");
const { createNotification } = require("../utils/notificationService");
const { createSessionSchema, updateSessionSchema, endSessionSchema, rescheduleSessionSchema } = require("../validation/session.validation");

//----------------------------------------normal Session-------------------------

// Role: patient
// المريض بيبعت طلب حجز بمعاد مقترح، والدكتور بعدين يأكد أو يرفض عن طريق updateSessionStatus
exports.createSession = async (req, res) => {
  try {
    // Joi Validation
    // ملحوظة: لو أسامي الفيلدز في createSessionSchema مختلفة عن اللي هنا، ظبطها حسب الـ schema بتاعتك
    const { error, value } = createSessionSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const { doctorId, type, mode, scheduledTime, location } = value;

    // ✅ لو الحجز بالكشف الفعلي، لازم يكون فيه عنوان
    if (mode === "visit" && (!location || !location.address)) {
      return res.status(400).json({
        success: false,
        message: "Location address is required when mode is 'visit'",
      });
    }

    // تأكيد إن الدكتور موجود فعلاً وموافق عليه
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (!doctor.isApproved) {
      return res.status(400).json({
        success: false,
        message: "This doctor is not approved yet",
      });
    }

    const patient = await Patient.findById(req.user.id);

    const session = await Session.create({
      patientId: patient._id,
      doctorId: doctor._id,
      patientname: patient.name,
      doctorname: doctor.name,
      type,
      mode,
      scheduledTime,
      location: mode === "visit" ? location : undefined,
      status: "pending",
    });

    // ✅ نبلغ الدكتور إن فيه طلب حجز جديد محتاج تأكيده
    const io = req.app.get("io");
    await createNotification(io, {
      recipientId: doctor._id,
      recipientModel: "doctor",
      type: "session_booked",
      title: "New Session Request",
      message: `${patient.name} has requested a new session with you`,
    });

    return res.status(201).json({
      success: true,
      message: "Session request created successfully. Waiting for doctor confirmation.",
      data: session,
    });
  } catch (error) {
    console.error("❌ Error creating session:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating session",
      error: error.message,
    });
  }
};

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
// Doctor and patient
//may filter by status, date range, and type
exports.getMySessions = async (req, res) => {
  try {
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

    // Fetch only the specific fields needed from the database
    const sessions = await Session.find(query)
      .select('_id scheduledTime patientname doctorname')
      .sort({ scheduledTime: 1 });

    // Map through the array and format each object exactly how you want it
    const formattedSessions = sessions.map(session => {
      // Determine which name to show based on the current user's role
      const displayName = req.user.role === 'doctor'
        ? session.patientname
        : session.doctorname;

      return {
        sessionId: session._id,
        name: displayName,
        time: session.scheduledTime
      };
    });

    return res.status(200).json({ success: true, data: formattedSessions });
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

    let query = {};

    if (userRole === "doctor") {
      query.doctorId = userId;
    } else if (userRole === "patient") {
      query.patientId = userId;
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
    });

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

    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, doctorId: req.user.id }, //req.user.id },  //for testing
      { status },
      { new: true },
    );

    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

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