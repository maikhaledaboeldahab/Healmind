const Joi = require("joi");
const { baseRegisterFields } = require("./User.validators");

// Register — Patient
const registerPatientSchema = Joi.object({
  ...baseRegisterFields,
  dateOfBirth: Joi.date().max("now").optional().messages({
    "date.max": "Date of birth cannot be in the future.",
  }),
  gender: Joi.string().valid("male", "female").optional().messages({
  }),
});
module.exports = {
  registerPatientSchema,
};
