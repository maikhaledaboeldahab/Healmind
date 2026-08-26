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
    .required()
    .messages({
      "any.required": "Slot ID is required."
    }),
  type: Joi.string()
    .valid("urgent", "followup")
    .optional(),
  mode: Joi.string()
    .valid("visit", "chat", "video", "online")
    .optional(),
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

const payBalanceSchema = Joi.object({
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
  mockChargeSchema,
  payBalanceSchema
};
