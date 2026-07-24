const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { User, Patient, Doctor ,Admin } = require("../models/User");
const { registerPatientSchema} = require("../validation/Patient.validators");
const { registerDoctorSchema } = require("../validation/doctor.validators");
const{resetPasswordSchema  ,forgotPasswordSchema,changePasswordSchema } = require("../validation/authValidators");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const path = require("path");
const sendTokenResponse = (res, statusCode, user, message) => {
  const payload = { id: user._id, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return res.status(statusCode).json({
    success: true,
    message,
    accessToken,
    refreshToken,
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
   
  });
};
// POST /auth/register/patient
const registerPatient = async (req, res) => {
  try {
    // Joi Validation
    const { error, value } = registerPatientSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const {
      name,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
    } = value;

    // Check if email already exists
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const patient = await Patient.create({
      name,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
    });

    return sendTokenResponse(
      res,
      201,
      patient,
      "Patient registered successfully."
    );

  } catch (err) {
    console.error("Register Patient Error:", err);

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
// POST /auth/register/doctor
const registerDoctor = async (req, res) => {
  try {
    // Joi Validation
    const { error, value } = registerDoctorSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });


    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const {
      name,
      email,
      password,
      phone,
      specialization,
      licenseNumber,
      bio,
      yearsOfExperience,
      sessionPrice,
      availableDays,
    } = value;

    // Certificate is required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Certificate is required for doctor registration.",
      });
    }

    // Check email
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // Store certificate path
    const certificatePath = `uploads/certificates/${req.file.filename}`;

    const doctor = await Doctor.create({
      name,
      email,
      password,
      phone,
      specialization,
      licenseNumber,
      bio,
      yearsOfExperience,
      sessionPrice,
      availableDays,
      certificate: certificatePath,
      isApproved: false,
    });

    return res.status(201).json({
      success: true,
      message:
        "Doctor registration request submitted successfully. Please wait for admin approval before logging in.",
     
    });

  } catch (err) {
    console.error("Register Doctor Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
// POST login
const login = async (req, res) => {
  try {
    console.log("req.body =", req.body);

    const { email, password } = req.body;

    


    // Retrieve user with password (password is excluded by default)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // Doctor accounts must be approved first
    if (user.role === "doctor" && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is still under review. Please wait for admin approval.",
      });
    }

    return sendTokenResponse(res, 200, user, "Login successful.");
  } catch (err) {
    console.error("Login Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// POST refresh-token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required.",
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token.",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or account is inactive.",
      });
    }

    const newAccessToken = generateAccessToken({ id: user._id, role: user.role });

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
  } catch (err) {
    console.error("Refresh Token Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// PATCH change-password  (Protected)
const changePassword = async (req, res) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const { currentPassword, newPassword } = value;

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = newPassword;
    await user.save();

    return sendTokenResponse(
      res,
      200,
      user,
      "Password changed successfully."
    );
  } catch (err) {
    console.error("Change Password Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// Email helper 
const sendResetEmail = async (user, resetToken) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await transporter.sendMail({
    from: `"HealMind Support" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Password Reset Request",
    html: `<p>Hi ${user.name},</p>
           <p>You requested a password reset. Click the link below (valid for 15 minutes):</p>
           <a href="${resetUrl}">${resetUrl}</a>
           <p>If you didn't request this, ignore this email.</p>`,
  });
};
// POST /auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const { email } = value;

    const user = await User.findOne({ email });

    const genericMessage =
      "If an account with that email exists, a reset link has been sent.";

    if (!user) {
      return res.status(200).json({
        success: true,
        message: genericMessage,
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    try {
      await sendResetEmail(user, resetToken);
    } catch (mailErr) {
      console.error(mailErr);

      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Could not send reset email.",
      });
    }

    return res.status(200).json({
      success: true,
      message: genericMessage,
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

  
    
// POST reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const { token } = req.params;
    const { newPassword } = value;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset token is invalid or has expired.",
      });
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return sendTokenResponse(
      res,
      200,
      user,
      "Password reset successfully."
    );
  } catch (err) {
    console.error("Reset Password Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
module.exports = {
  registerPatient,
  registerDoctor,
  login,
  refreshToken,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
};