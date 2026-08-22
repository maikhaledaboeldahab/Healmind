const Joi = require("joi");

// ✅ متطابقة تمامًا مع enum القيم الموجودة فعليًا في session.model.js
const SESSION_TYPES = ["urgent", "followup"];
const SESSION_MODES = ["visit", "chat", "video"];
const SESSION_STATUSES = ["pending", "confirmed", "completed", "cancelled", "rejected"];

// ✅ يُستخدم عند إنشاء سيشن جديدة (المريض هو اللي بيحجز)
// ملحوظة: patientId اتشال من هنا عن قصد — بيتاخد من req.user.id (التوكن)
// مش من الـ body، عشان محدش يقدر يحجز باسم مريض تاني
const createSessionSchema = Joi.object({
  doctorId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid doctor ID format.",
      "any.required": "Doctor ID is required.",
    }),

  type: Joi.string()
    .valid(...SESSION_TYPES)
    .required()
    .messages({
      "any.only": `Session type must be one of: ${SESSION_TYPES.join(", ")}.`,
      "any.required": "Session type is required.",
    }),

  mode: Joi.string()
    .valid(...SESSION_MODES)
    .required()
    .messages({
      "any.only": `Session mode must be one of: ${SESSION_MODES.join(", ")}.`,
      "any.required": "Session mode is required.",
    }),

  scheduledTime: Joi.date().required().messages({
    "any.required": "Scheduled time is required.",
    "date.base": "Scheduled time must be a valid date.",
  }),

  // مطلوب بس لو mode = "visit"، هنتأكد من ده في الـ controller نفسه
  location: Joi.object({
    address: Joi.string().max(300).optional(),
  }).optional(),
});

// ✅ يُستخدم في updateSessionStatus و submitVisitReport
const updateSessionSchema = Joi.object({
  status: Joi.string()
    .valid(...SESSION_STATUSES)
    .optional(),

  diagnosis: Joi.string().max(1000).allow(null, "").optional(),

  notes: Joi.string().max(1000).allow(null, "").optional(),

  followUpDate: Joi.date().allow(null, "").optional(),

  prescription: Joi.string().max(500).allow(null, "").optional(),

  // موجود في validation القديمة بس مش مستخدم فعليًا في submitVisitReport الحالية
  // (سايبينه اختياري عشان مايكسرش حاجة لو حد استخدمه بعدين)
  slots: Joi.array().optional(),
});

const endSessionSchema = Joi.object({
  notes: Joi.string()
    .max(1000)
    .required()
    .messages({ "any.required": "Notes are required to end the session." }),

  prescription: Joi.string().max(500).allow(null, "").optional(),
});

const rescheduleSessionSchema = Joi.object({
  newScheduledTime: Joi.date().required().messages({
    "any.required": "New scheduled time is required.",
    "date.base": "New scheduled time must be a valid date.",
  }),
});

module.exports = {
  createSessionSchema,
  updateSessionSchema,
  endSessionSchema,
  rescheduleSessionSchema,
};