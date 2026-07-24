const Joi = require("joi");
const mongoose = require("mongoose");

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
};

const createReviewSchema = Joi.object({
  doctor: Joi.string().custom(objectId).required(),

  reviewText: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .required(),

  rating: Joi.number()
    .min(1)
    .max(5)
    .required(),
});

const updateReviewSchema = Joi.object({
  reviewText: Joi.string()
    .trim()
    .min(5)
    .max(500),

  rating: Joi.number()
    .min(1)
    .max(5),
});

module.exports = {
  createReviewSchema,
  updateReviewSchema,
};