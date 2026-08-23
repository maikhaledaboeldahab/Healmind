const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    // ======================================================
    // Patient who created the ticket
    // ======================================================
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    patientName: {
      type: String,
      trim: true,
      required: true,
    },

    // ======================================================
    // Doctor assigned by Admin
    // ======================================================
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    doctorName: {
      type: String,
      trim: true,
      default: null,
    },

    // ======================================================
    // Patient requested session time
    // ======================================================
    scheduledTime: {
      type: Date,
      required: true,
      index: true,
    },

    // ======================================================
    // Session mode
    // ======================================================
    mode: {
      type: String,
      enum: ["chat", "video"],
      required: true,
    },

    // ======================================================
    // Ticket status
    // ======================================================
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    // ======================================================
    // Admin who assigned doctor
    // ======================================================
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedAt: {
      type: Date,
      default: null,
    },

    // ======================================================
    // Cancellation
    // ======================================================
    cancellationReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// Indexes
// ======================================================

ticketSchema.index({
  status: 1,
  scheduledTime: 1,
});

ticketSchema.index({
  patientId: 1,
  status: 1,
});

ticketSchema.index({
  assignedDoctor: 1,
  scheduledTime: 1,
});

// ======================================================
// Model
// ======================================================

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;