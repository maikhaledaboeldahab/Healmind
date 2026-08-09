//analyze session.model and session.controller and generate joi schema

const Joi = require("joi");

const baseSessionSchema = Joi.object({
    patientId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            "string.pattern.base": "Invalid patient ID format.",
            "any.required": "Patient ID is required.",
        }),

    doctorId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            "string.pattern.base": "Invalid doctor ID format.",
            "any.required": "Doctor ID is required.",
        }),

    scheduledTime: Joi.object({
        date: Joi.date().required().messages({
            "any.required": "Session date is required.",
        }),
        time: Joi.string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .required()
            .messages({
                "string.pattern.base": "Time must be in HH:mm format (24-hour).",
                "any.required": "Session time is required.",
            }),
    })
        .required()
        .messages({ "any.required": "Scheduled time is required." }),

    type: Joi.string()
        .valid("online", "in-person")
        .required()
        .messages({
            "any.only": "Session type must be either 'online' or 'in-person'.",
            "any.required": "Session type is required.",
        }),

    mode: Joi.string()
        .valid("video", "voice", "chat")
        .default("video")
        .messages({
            "any.only": "Session mode must be 'video', 'voice', or 'chat'.",
        }),
});

// Add status enum validation for completeness, though it's typically handled by other logic
const sessionSchema = baseSessionSchema.append({
    status: Joi.string()
        .valid("scheduled", "completed", "cancelled", "rescheduled")
        .default("scheduled")
        .messages({
            "any.only": "Status must be one of: scheduled, completed, cancelled, rescheduled.",
        }),

    notes: Joi.string()
        .max(1000)
        .allow(null, "")
        .messages({
            "string.max": "Notes cannot exceed 1000 characters.",
        }),

    prescription: Joi.string()
        .max(500)
        .allow(null, "")
        .messages({
            "string.max": "Prescription cannot exceed 500 characters.",
        }),

    report: Joi.string()
        .allow(null, "")
        .messages({
            "string.base": "Report must be a string.",
        }),
});

// Create schemas for different operations
const createSessionSchema = baseSessionSchema;


//diagnosis, notes, followUpDate, prescription
const updateSessionSchema = Joi.object({
    scheduledTime: Joi.object({
        date: Joi.date().required(),
        time: Joi.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    }).optional(),

    type: Joi.string()
        .valid("online", "in-person")
        .optional(),

    mode: Joi.string()
        .valid("video", "voice", "chat")
        .optional(),

    status: Joi.string()
        .valid("pending", "confirmed", "completed", "cancelled", "rejected")
        .optional(),

    notes: Joi.string()
        .max(1000)
        .allow(null, "")
        .optional(),

    prescription: Joi.string()
        .max(500)
        .allow(null, "")
        .optional(),

    report: Joi.string()
        .allow(null, "")
        .optional(),


    diagnosis: Joi.string()
        .max(1000)
        .allow(null, "")
        .optional(),

    followUpDate: Joi.date()
        .allow(null, "")
        .optional(),
});

const endSessionSchema = Joi.object({
    notes: Joi.string()
        .max(1000)
        .required()
        .messages({ "any.required": "Notes are required to end the session." }),

    prescription: Joi.string()
        .max(500)
        .allow(null, "")
        .optional(),
});

const rescheduleSessionSchema = Joi.object({
    newScheduledTime: Joi.object({
        date: Joi.date().required(),
        time: Joi.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    }).required(),
});

module.exports = {
    createSessionSchema,
    updateSessionSchema,
    endSessionSchema,
    rescheduleSessionSchema,
    sessionSchema, // Full schema with all fields
    baseSessionSchema, // Schema for creation (without optional fields)
};
