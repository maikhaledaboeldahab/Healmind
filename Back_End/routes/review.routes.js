const express = require("express");

const router = express.Router();

const {
  createReview,
  getDoctorReviews,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createReview);

router.get("/:doctorId", getDoctorReviews);

router.put("/:id", protect, updateReview);

router.delete("/:id", protect, deleteReview);

module.exports = router;