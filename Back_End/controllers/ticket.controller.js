const mongoose = require("mongoose");

const Ticket = require("../models/ticket.model");
const { User, Doctor } = require("../models/User");


// ======================================================
// 1. CREATE TICKET
// POST /api/ticket/patient
// Patient creates a free initial session request
// ======================================================

const createTicket = async (req, res) => {
  try {
    const { scheduledTime, mode } = req.body;

    // --------------------------------------------------
    // Make sure logged-in user is a patient
    // --------------------------------------------------

    if (req.user.role !== "patient") {
      return res.status(403).json({
        success: false,
        message: "Only patients can create tickets.",
      });
    }

    // --------------------------------------------------
    // Validate scheduled time
    // --------------------------------------------------

    const requestedTime = new Date(scheduledTime);

    if (isNaN(requestedTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheduled time.",
      });
    }

    if (requestedTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Scheduled time must be in the future.",
      });
    }

    // --------------------------------------------------
    // Check if patient already has a ticket
    // at the same time
    // --------------------------------------------------

    const existingTicket = await Ticket.findOne({
      patientId: req.user._id,
      scheduledTime: requestedTime,
      status: {
        $in: ["pending", "confirmed"],
      },
    });

    if (existingTicket) {
      return res.status(400).json({
        success: false,
        message:
          "You already have a pending or confirmed ticket at this time.",
      });
    }

    // --------------------------------------------------
    // Create ticket
    // --------------------------------------------------

    const ticket = await Ticket.create({
      patientId: req.user._id,
      patientName: req.user.name,

      scheduledTime: requestedTime,

      mode,

      status: "pending",

      assignedDoctor: null,
      doctorName: null,

      assignedBy: null,
      assignedAt: null,
    });

    return res.status(201).json({
      success: true,
      message: "Session request created successfully.",
      data: ticket,
    });

  } catch (error) {
    console.error("Create Ticket Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


// ======================================================
// 2. GET MY TICKETS
// GET /api/ticket/patient
// Patient gets his own tickets
// ======================================================

const getMyTickets = async (req, res) => {
  try {

    if (req.user.role !== "patient") {
      return res.status(403).json({
        success: false,
        message: "Only patients can access their tickets.",
      });
    }

    const tickets = await Ticket.find({
      patientId: req.user._id,
    })
      .populate({
        path: "assignedDoctor",
        select: "name email specialization profileImage",
      })
      .populate({
        path: "assignedBy",
        select: "name email role",
      })
      .sort({
        scheduledTime: 1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });

  } catch (error) {
    console.error("Get My Tickets Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


// ======================================================
// 3. GET PENDING TICKETS
// GET /api/ticket/admin/pending
// Admin sees tickets waiting for doctor assignment
// ======================================================

const getPendingTickets = async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only.",
      });
    }

    const tickets = await Ticket.find({
      status: "pending",
    })
      .populate({
        path: "patientId",
        select: "name email phone profileImage role",
      })
      .sort({
        scheduledTime: 1,
        createdAt: 1,
      });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });

  } catch (error) {
    console.error("Get Pending Tickets Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


// ======================================================
// 4. GET AVAILABLE DOCTORS
// GET /api/ticket/admin/:id/available-doctors
//
// Admin sends Ticket ID
// System gets requested time from ticket
// Then searches doctors' slots
// ======================================================

const getAvailableDoctors = async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only.",
      });
    }

    const { id } = req.params;

    // --------------------------------------------------
    // Validate Ticket ID
    // --------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID.",
      });
    }

    // --------------------------------------------------
    // Find Ticket
    // --------------------------------------------------

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    // --------------------------------------------------
    // Only pending tickets
    // --------------------------------------------------

    if (ticket.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "Doctors can only be searched for pending tickets.",
      });
    }

    const requestedTime = new Date(ticket.scheduledTime);

    // --------------------------------------------------
    // Day of requested session
    // --------------------------------------------------

    const requestedDay = requestedTime.toISOString().split("T")[0];

    // --------------------------------------------------
    // Requested time
    // Example:
    // 18:00
    // --------------------------------------------------

    const requestedHours = requestedTime.getHours();
    const requestedMinutes = requestedTime.getMinutes();

    // --------------------------------------------------
    // Get approved doctors
    // --------------------------------------------------

    const doctors = await Doctor.find({
      role: "doctor",
      isApproved: true,
      approvalStatus: "approved",
    }).select(
      "name email phone profileImage specialization licenseNumber yearsOfExperience slots"
    );

    // --------------------------------------------------
    // Filter doctors based on slots
    // --------------------------------------------------

    const availableDoctors = doctors.filter((doctor) => {

      if (!doctor.slots || doctor.slots.length === 0) {
        return false;
      }

      return doctor.slots.some((slot) => {

        if (!slot.day) {
          return false;
        }

        const slotDate = new Date(slot.day);

        const slotDay = slotDate.toISOString().split("T")[0];

        // Same date
        if (slotDay !== requestedDay) {
          return false;
        }

        // If slot has no specific time,
        // consider doctor available that day
        if (!slot.time) {
          return true;
        }

        // Expected format: "18:00"
        const [slotHours, slotMinutes] =
          slot.time.split(":").map(Number);

        return (
          slotHours === requestedHours &&
          slotMinutes === requestedMinutes
        );
      });
    });

    return res.status(200).json({
      success: true,

      ticket: {
        id: ticket._id,
        patientName: ticket.patientName,
        scheduledTime: ticket.scheduledTime,
        mode: ticket.mode,
      },

      count: availableDoctors.length,

      data: availableDoctors,
    });

  } catch (error) {
    console.error("Get Available Doctors Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


// ======================================================
// 5. ASSIGN DOCTOR
// PATCH /api/ticket/admin/:id/assign
//
// Admin chooses doctor
// ======================================================

const assignDoctor = async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only.",
      });
    }

    const { id } = req.params;
    const { doctorId } = req.body;

    // --------------------------------------------------
    // Validate IDs
    // --------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID.",
      });
    }

    // --------------------------------------------------
    // Find ticket
    // --------------------------------------------------

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    // --------------------------------------------------
    // Ticket must be pending
    // --------------------------------------------------

    if (ticket.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          `Ticket cannot be assigned because it is ${ticket.status}.`,
      });
    }

    // --------------------------------------------------
    // Find doctor
    // --------------------------------------------------

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    // --------------------------------------------------
    // Make sure user is doctor
    // --------------------------------------------------

    if (doctor.role !== "doctor") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a doctor.",
      });
    }

    // --------------------------------------------------
    // Doctor must be approved
    // --------------------------------------------------

    if (
      !doctor.isApproved ||
      doctor.approvalStatus !== "approved"
    ) {
      return res.status(400).json({
        success: false,
        message: "Doctor is not approved.",
      });
    }

    // --------------------------------------------------
    // Check doctor's availability
    // --------------------------------------------------

    const requestedTime = new Date(ticket.scheduledTime);

    const requestedDay =
      requestedTime.toISOString().split("T")[0];

    const requestedHours = requestedTime.getHours();
    const requestedMinutes = requestedTime.getMinutes();

    const hasMatchingSlot = doctor.slots?.some((slot) => {

      if (!slot.day) {
        return false;
      }

      const slotDate = new Date(slot.day);

      const slotDay =
        slotDate.toISOString().split("T")[0];

      if (slotDay !== requestedDay) {
        return false;
      }

      if (!slot.time) {
        return true;
      }

      const [slotHours, slotMinutes] =
        slot.time.split(":").map(Number);

      return (
        slotHours === requestedHours &&
        slotMinutes === requestedMinutes
      );
    });

    if (!hasMatchingSlot) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor is not available at the requested time.",
      });
    }

    // --------------------------------------------------
    // Check if doctor already has another session
    // at the same time
    // --------------------------------------------------

    const existingTicket = await Ticket.findOne({
      assignedDoctor: doctor._id,
      scheduledTime: ticket.scheduledTime,
      status: "confirmed",
    });

    if (existingTicket) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor already has a confirmed session at this time.",
      });
    }

    // --------------------------------------------------
    // Assign doctor
    // --------------------------------------------------

    ticket.assignedDoctor = doctor._id;
    ticket.doctorName = doctor.name;

    ticket.assignedBy = req.user._id;
    ticket.assignedAt = new Date();

    ticket.status = "confirmed";

    await ticket.save();

    // --------------------------------------------------
    // Return populated ticket
    // --------------------------------------------------

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate({
        path: "patientId",
        select: "name email phone profileImage role",
      })
      .populate({
        path: "assignedDoctor",
        select:
          "name email phone profileImage specialization yearsOfExperience",
      })
      .populate({
        path: "assignedBy",
        select: "name email role",
      });

    return res.status(200).json({
      success: true,
      message: "Doctor assigned successfully.",
      data: updatedTicket,
    });

  } catch (error) {
    console.error("Assign Doctor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  createTicket,
  getMyTickets,
  getPendingTickets,
  getAvailableDoctors,
  assignDoctor,
};