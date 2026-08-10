const Review = require("../models/Review");
const { Doctor } = require("../models/User");

const {
  createReviewSchema,
  updateReviewSchema,
} = require("../validation/review.validator");


//patient role
const createReview = async (req, res) => {
  try {
    const { error, value } = createReviewSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.details.map(err => err.message),
      });
    }

    const doctor = await Doctor.findById(value.doctor);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const review = await Review.create({
      doctor: value.doctor,
      user: req.user.id,
      reviewText: value.reviewText,
      rating: value.rating,
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//role(patient , doctor , admin)
const getDoctorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      doctor: req.params.doctorId,
    })
      .populate("user", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



//role(patient)
const updateReview = async (req, res) => {
  try {
    const { error } = updateReviewSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    Object.assign(review, req.body);

    await review.save();

    res.status(200).json({
      message: "Review updated",
      review,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


//role(patient)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await review.deleteOne();

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
module.exports = {
  createReview,
  getDoctorReviews,
  updateReview,
  deleteReview,
};