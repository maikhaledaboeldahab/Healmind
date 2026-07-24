const express = require("express");
const router = express.Router();

const {
  createContact,
  getAllContacts,
  getContactById,
  markAsRead,
  deleteContact,
} = require("../controllers/contactus.controller");

const {
  createContactSchema,
} = require("../validation/contactusvalidators");

const { validate } = require("../validation/User.validators");

const { protect, restrictTo } = require("../middleware/authMiddleware");

// Public
router.post(
  "/",
  validate(createContactSchema),
  createContact
);

// Admin
router.get(
  "/",
  protect,
  restrictTo("admin"),
  getAllContacts
);

router.get(
  "/:id",
  protect,
  restrictTo("admin"),
  getContactById
);

router.patch(
  "/:id/read",
  protect,
  restrictTo("admin"),
  markAsRead
);

router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  deleteContact
);

module.exports = router;