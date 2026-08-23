const jwt = require("jsonwebtoken");
const { User } = require("../models/User");


const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};


const protect = async (req, res, next) => {
  try {
    // Get token from Authorization header
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in first.",
      });
    }

    // Verify token
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Session expired. Please log in again.",
          code: "TOKEN_EXPIRED",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid token.",
        code: "INVALID_TOKEN",
      });
    }

    // Check if user still exists and is active
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!currentUser.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // Attach user to request object
    req.user = currentUser;

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);

    return res.status(500).json({
      success: false,
      message: "Authentication failed due to an internal server error.",
    });
  }
};

// ─────────────────────────────────────────────
// Middleware — Restrict Access to Specific Roles
// Usage:
// restrictTo("admin")
// restrictTo("admin", "doctor")
// ─────────────────────────────────────────────
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role "${req.user.role}" is not authorized to perform this action.`,
      });
    }

    next();
  };
};


// Middleware — Require Approved Doctor

const requireApprovedDoctor = (req, res, next) => {
  if (req.user.role === "doctor" && !req.user.isApproved) {
    return res.status(403).json({
      success: false,
      message:
        "Your doctor account is still under review. Please wait for admin approval.",
    });
  }

  next();
};
const superAdminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated.",
    });
  }

  if (
    req.user.role !== "admin" ||
    !req.user.isSuperAdmin
  ) {
    return res.status(403).json({
      success: false,
      message: "Super Admin access required.",
    });
  }

  next();
};


module.exports = {
  protect,
  restrictTo,
  requireApprovedDoctor,
  generateAccessToken,
  generateRefreshToken,
  superAdminOnly,
};