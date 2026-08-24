

const { Patient } = require("../models/User"); // ⚠️ عدّلي المسار لو اسم الملف مختلف
const asyncHandler = require("../middleware/asyncHandler");

/**
 * @desc    Doctor gets list of their patients pending community approval
 * @route   GET /api/doctor/community-access/pending
 * @access  Private (doctor)
 */
exports.getPendingPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({
    therapistId: req.user._id,
    communityAccess: "pending",
  }).select("name email profileImage communityAccess");

  res.status(200).json({ success: true, data: patients });
});

/**
 * @desc    Doctor approves or rejects a specific patient's community access
 * @route   PATCH /api/doctor/community-access/:patientId
 * @access  Private (doctor — must be that patient's assigned therapist)
 */
exports.decideCommunityAccess = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { decision } = req.body; // "approved" | "rejected"

  if (!["approved", "rejected"].includes(decision)) {
    return res.status(400).json({
      success: false,
      message: 'decision يجب أن تكون "approved" أو "rejected".',
    });
  }

  const patient = await Patient.findById(patientId);

  if (!patient) {
    return res.status(404).json({ success: false, message: "Patient not found." });
  }

  // ✅ تأكد إن الدكتور اللي بيوافق هو فعلاً الدكتور المسؤول عن المريض ده
  if (!patient.therapistId || patient.therapistId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not the assigned therapist for this patient.",
    });
  }

  patient.communityAccess = decision;
  patient.communityAccessDecidedBy = req.user._id;
  patient.communityAccessDecidedAt = new Date();
  await patient.save();

  // 🔴 لو عايزة، ممكن تبعتيله إشعار real-time إنه اتوافق عليه
  const io = req.app.get("io");
  if (patient.socketId) {
    io.to(patient.socketId).emit("communityAccessUpdated", {
      status: patient.communityAccess,
    });
  }

  res.status(200).json({
    success: true,
    message: `Patient community access ${decision}.`,
    data: {
      patientId: patient._id,
      communityAccess: patient.communityAccess,
    },
  });
});
