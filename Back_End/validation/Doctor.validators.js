const Joi = require("joi");
const { baseRegisterFields } = require("./User.validators");

// Register — Doctor
const registerDoctorSchema = Joi.object({
  ...baseRegisterFields,
  NationalId: Joi.string().min(14).max(14).required().messages({
    "string.min": "National ID must be at least 14 characters long.",
    "string.max": "National ID must not exceed 14 characters.",
    "any.required": "National ID is required.",
  }),
  specialization: Joi.string().min(2).max(100).required().messages({
    "string.min": "Specialization must be at least 2 characters long.",
    "any.required": "License number is required.",

  }),
  licenseNumber: Joi.string().min(4).max(50).required().messages({
    "string.min": "License number must be at least 4 characters long.",
    "string.max": "License number must not exceed 50 characters.",
    "any.required": "License number is required.",
  }),
  bio: Joi.string().max(500).optional().messages({
    "string.max": "Bio must not exceed 500 characters.",
  }),
  yearsOfExperience: Joi.number().min(0).default(0).messages({
    "number.min": "Years of experience cannot be negative.",
  }),
  sessionPrice: Joi.number().min(0).default(0).messages({
    "number.min": "Session price cannot be negative.",
  }),
  availableDays: Joi.array()
    .items(
      Joi.string().valid("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat")
    )
    .optional(),
});



module.exports = {
  registerDoctorSchema,
};