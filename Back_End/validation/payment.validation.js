const Joi = require("joi");

const checkoutSessionSchema = Joi.object({
  doctorId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid doctor ID format.",
      "any.required": "Doctor ID is required."
    }),
  slotId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid slot ID format.",
      "any.required": "Slot ID is required."
    }),
  type: Joi.string()
    .valid("urgent", "followup")
    .optional()
    .messages({
      "any.only": "Session type must be either 'urgent' or 'followup'."
    }),
  mode: Joi.string()
    .valid("visit", "chat", "video")
    .optional()
    .messages({
      "any.only": "Session mode must be either 'visit' or 'chat'."
    }),
  depositAmount: Joi.number()
    .min(0)
    .optional()
    .messages({
      "number.min": "Deposit amount cannot be negative."
    })
});

const mockChargeSchema = Joi.object({
  sessionId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid session ID format.",
      "any.required": "Session ID is required."
    })
});

module.exports = {
  checkoutSessionSchema,
  mockChargeSchema
};
