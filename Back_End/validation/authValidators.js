const Joi = require("joi");

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().min(8).required(),
});

module.exports = {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};


