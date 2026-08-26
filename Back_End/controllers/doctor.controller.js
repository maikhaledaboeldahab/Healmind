const { Doctor, Patient } = require("../models/User");
const {
  updateDoctorProfileSchema,
} = require("../validation/Profile.validators");


// Get Profile user or doctor
// const getProfile implemented in profile.conntroller

// Update Profile Image
// const updateProfileImage implemented in profile.conntroller

// Update Doctor Profile
const updateDoctorProfile = async (req, res) => {
  try {
    // Joi Validation
    const { error, value } = updateDoctorProfileSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const doctor = await Doctor.findById(req.user.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    // Common fields
    if (value.name !== undefined) doctor.name = value.name;
    if (value.phone !== undefined) doctor.phone = value.phone;

    // Doctor fields
    if (value.specialization !== undefined)
      doctor.specialization = value.specialization;

    if (value.bio !== undefined) doctor.bio = value.bio;

    if (value.yearsOfExperience !== undefined)
      doctor.yearsOfExperience = value.yearsOfExperience;

    if (value.sessionPrice !== undefined)
      doctor.sessionPrice = value.sessionPrice;

    if (value.availableDays !== undefined)
      doctor.availableDays = value.availableDays;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully.",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPatientHistory = async (req, res) => {
  try {
    const patientId = req.params.id; // or req.user.id

    const patient = await Patient.findById(patientId)
      .populate({
        path: "sessionHistory",
        select: "doctorname scheduledTime status type mode prescription report createdAt",
        options: { sort: { createdAt: -1 } }, // Most recent sessions first
      });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      success: true,
      history: patient.sessionHistory, // Contains all sessions with reports & prescriptions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



//Availability and setting slots

const setSlots = async (req, res) => {
  try {
    const { error, value } = updateDoctorProfileSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }
    const { slots } = value;
    const doctorId = req.user.id;


    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }


    //deny duplication
    const newSlots = slots.filter(newSlot => {
      return !doctor.slots.some(existing =>
        new Date(existing.day).toISOString() === new Date(newSlot.day).toISOString() &&
        existing.time === newSlot.time
      );
    });

    if (newSlots.length === 0) {
      return res.status(400).json({ success: false, message: "All provided slots already exist." });
    }


    const updateddoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      {
        $push: {
          slots: { $each: slots },
        },
      },
      { new: true, runValidators: true },
    );


    res.status(200).json({ message: "slots added", data: updateddoctor.slots, name: updateddoctor.name });
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
};


const getSlots = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select("slots");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ slots: doctor.slots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAllSlots = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    doctor.slots = [];
    await doctor.save();
    res.status(200).json({ message: "slots deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSlot = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const slotId = req.params.id;

    doctor.slots.pull(slotId);

    await doctor.save();

    res.status(200).json({ message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const editSlot = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const slotId = req.params.id;

    // Extract time and day from req.body
    const { time, day } = req.body;

    // 1. Find the doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // 2. Find the specific subdocument inside the slots array
    const slot = doctor.slots.id(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // 3. Update the fields only if they are provided in the request
    if (time !== undefined) slot.time = time;
    if (day !== undefined) slot.day = day;

    // 4. Save the parent document (Mongoose tracks the subdocument changes for you!)
    await doctor.save();

    res.status(200).json({
      message: "Slot updated successfully",
      data: slot,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId).select("slots");
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Filter slots where isBooked is false/undefined/not true
    const availableSlots = doctor.slots.filter(slot => !slot.isBooked);

    res.status(200).json({ success: true, slots: availableSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicDoctors = async (req, res) => {
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPublicDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password");
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  updateDoctorProfile,
  getPatientHistory,
  setSlots,
  getSlots,
  deleteAllSlots,
  deleteSlot,
  editSlot,
  getAvailableSlots,
  getPublicDoctors,
  getPublicDoctorById,
};

