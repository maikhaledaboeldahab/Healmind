const express = require("express");

const {
  createTicket,
  getMyTickets,
  getPendingTickets,
  getAvailableDoctors,
  assignDoctor,
} = require("../controllers/ticket.controller");

const {
  protect,
  restrictTo,
} = require("../middleware/authMiddleware");

const validate = require("../middleware/validationMiddleware");

const {
  createTicketSchema,
  assignDoctorSchema,
} = require("../validation/ticket.validation");

const router = express.Router();


// ======================================================
// PATIENT
// ======================================================

// Create Ticket
// POST /api/ticket/patient

router.post(
  "/patient",
  protect,
  restrictTo("patient"),
  validate(createTicketSchema),
  createTicket
);


// Get My Tickets
// GET /api/ticket/patient

router.get(
  "/patient",
  protect,
  restrictTo("patient"),
  getMyTickets
);


// ======================================================
// ADMIN
// ======================================================

// Get Pending Tickets
// GET /api/ticket/admin/pending

router.get(
  "/admin/pending",
  protect,
  restrictTo("admin"),
  getPendingTickets
);


// Get Available Doctors
// GET /api/ticket/admin/:id/available-doctors

router.get(
  "/admin/:id/available-doctors",
  protect,
  restrictTo("admin"),
  getAvailableDoctors
);


// Assign Doctor
// PATCH /api/ticket/admin/:id/assign

router.patch(
  "/admin/:id/assign",
  protect,
  restrictTo("admin"),
  validate(assignDoctorSchema),
  assignDoctor
);


module.exports = router;