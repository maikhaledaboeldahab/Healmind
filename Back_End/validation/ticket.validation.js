const Joi = require("joi");

const createTicketSchema = Joi.object({
  scheduledTime: Joi.date()
    .iso()
    .greater("now")
    .required()
    .messages({
      "date.base": "Scheduled time must be a valid date.",
      "date.format": "Scheduled time must be in ISO format.",
      "date.greater": "Scheduled time must be in the future.",
      "any.required": "Scheduled time is required.",
    }),

  mode: Joi.string()
    .valid("chat", "video")
    .required()
    .messages({
      "any.only": "Mode must be either chat or video.",
      "any.required": "Mode is required.",
    }),
}).unknown(false);

const assignDoctorSchema = Joi.object({
  doctorId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.hex": "Doctor ID must be a valid MongoDB ObjectId.",
      "string.length": "Doctor ID must be a valid MongoDB ObjectId.",
      "any.required": "Doctor ID is required.",
    }),
}).unknown(false);

module.exports = {
  createTicketSchema,
  assignDoctorSchema,
};