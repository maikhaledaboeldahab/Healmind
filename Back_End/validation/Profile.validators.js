const Joi = require("joi");
const { name, email, phone } = require("../validation/User.validators");



//update profile schema
const updateProfileSchema = Joi.object({
  name: name.optional(),

  email: email.optional(),

  phone: phone.optional(),
}).min(1).messages({
  "object.min": "Please provide at least one field to update.",
});
//update doctor profile schema
const updateDoctorProfileSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name must not exceed 50 characters.",
  }),
  phone: phone,
  specialization: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Specialization must be at least 2 characters long.",
  }),
  bio: Joi.string().max(500).optional().messages({
    "string.max": "Bio must not exceed 500 characters.",
  }),
  yearsOfExperience: Joi.number().min(0).optional().messages({
    "number.min": "Years of experience cannot be negative.",
  }),
  sessionPrice: Joi.number().min(0).optional().messages({
    "number.min": "Session price cannot be negative.",
  }),
  availableDays: Joi.array()
    .items(
      Joi.string().valid("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat")
    )
    .optional(),
}).min(1);

module.exports = {
  updateProfileSchema,
  updateDoctorProfileSchema,
};