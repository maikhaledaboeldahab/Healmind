const {
  User,
  Patient,
  Doctor,
} = require("../models/User");

// ======================================================
// Approve Doctor
// PATCH /admin/doctors/:id/approve
// ======================================================

const approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    if (doctor.approvalStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Doctor is already ${doctor.approvalStatus}.`,
      });
    }

    doctor.isApproved = true;
    doctor.approvalStatus = "approved";
    doctor.approvedBy = req.user.id;
    doctor.approvedAt = new Date();

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Doctor approved successfully.",
      data: doctor,
    });
  } catch (error) {
    console.error("Approve Doctor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ======================================================
// Reject Doctor
// PATCH /admin/doctors/:id/reject
// ======================================================

const rejectDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    if (doctor.approvalStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Doctor is already ${doctor.approvalStatus}.`,
      });
    }

    doctor.isApproved = false;
    doctor.approvalStatus = "rejected";
    doctor.approvedBy = null;
    doctor.approvedAt = null;

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Doctor rejected successfully.",
      data: doctor,
    });
  } catch (error) {
    console.error("Reject Doctor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ======================================================
// Get Pending Doctors
// GET /admin/doctors/pending
// ======================================================

const getPendingDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      approvalStatus: "pending",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("Get Pending Doctors Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ======================================================
// Get Approved Doctors
// GET /admin/doctors/approved
// ======================================================

const getApprovedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      approvalStatus: "approved",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("Get Approved Doctors Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ======================================================
// Get All Doctors
// GET /admin/doctors
// ======================================================

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("Get All Doctors Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ======================================================
// Get Doctor By ID
// GET /admin/doctors/:id
// ======================================================

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("Get Doctor By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ======================================================
// Get All Users
// GET /admin/users
// ======================================================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ======================================================
// Get All Patients
// GET /admin/patients
// ======================================================

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error("Get All Patients Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ======================================================
// Activate User
// PATCH /admin/users/:id/activate
// ======================================================

const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isActive) {
      return res.status(400).json({
        success: false,
        message: "User is already active.",
      });
    }

    user.isActive = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User activated successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Activate User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ======================================================
// Deactivate User
// PATCH /admin/users/:id/deactivate
// ======================================================

const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "User is already inactive.",
      });
    }

    user.isActive = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Deactivate User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ======================================================
// Delete User
// DELETE /admin/users/:id
// ======================================================

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin users cannot be deleted.",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ======================================================
// Delete Patient
// DELETE /admin/patients/:id
// ======================================================

const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    await Patient.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Patient Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ======================================================
// Export
// ======================================================

module.exports = {
  approveDoctor,
  rejectDoctor,
  getPendingDoctors,
  getApprovedDoctors,
  getAllDoctors,
  getDoctorById,

  getAllUsers,
  getAllPatients,

  activateUser,
  deactivateUser,

  deleteUser,
  deletePatient,
};