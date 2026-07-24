const Joi = require("joi");

const createContactSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.min": "Name must be at least 3 characters.",
      "string.max": "Name must not exceed 50 characters.",
      "any.required": "Name is required.",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Invalid email.",
      "any.required": "Email is required.",
    }),

  subject: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "any.required": "Subject is required.",
    }),

  message: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      "any.required": "Message is required.",
    }),
});

module.exports = {
  createContactSchema,
};