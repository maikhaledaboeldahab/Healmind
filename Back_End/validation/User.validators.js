const Joi = require("joi");
const name = Joi.string().min(3).max(50).required().messages({
  "string.min": "Name must be at least 3 characters long.",
  "string.max": "Name must not exceed 50 characters.",
  "any.required": "Name is required.",
});
const email = Joi.string().email().lowercase().required().messages({
  "string.email": "Invalid email address.",
  "any.required": "Email is required.",
});
const password = Joi.string()
  .min(8)
  .max(64)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#])/)
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters long.",
    "string.max": "Password must not exceed 64 characters.",
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    "any.required": "Password is required.",
  });
  const confirmPassword = Joi.string()
  .valid(Joi.ref("password"))
  .required()
  .messages({
    "any.only": "Passwords do not match.",
    "any.required": "Confirm password is required.",
  });
  const phone = Joi.string()
  .pattern(/^(\+20|0)?1[0125]\d{8}$/)
  .optional()
  .messages({
    "string.pattern.base": "Phone number must be a valid Egyptian phone number.",
  });

  const baseRegisterFields = {
    name: name,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
    phone: phone,
  };

  // Login Schema (any role)
  const loginSchema = Joi.object({
    email: email,
    password: Joi.string().required().messages({
      "any.required": "Password is required.",
    }),
  });
  const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const data = source === "body" ? req.body : req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: error.details.map((err) => err.message),
      });
    }

    req[source] = value;
    next();
  };
};
  

  module.exports ={validate, loginSchema , baseRegisterFields, name, email, password, confirmPassword, phone}