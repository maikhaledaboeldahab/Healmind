const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// role is determined by the discriminatorKey "role" in the schema options
const userOptions = {
  discriminatorKey: "role",
  timestamps: true,
};

// =============================================
// Base User Schema
// =============================================

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long."],
      maxlength: [50, "Name must not exceed 50 characters."],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."],
      select: false,
    },

    phone: {
      type: String,
      trim: true,
    },

    profileImage: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  userOptions
);

// =============================================
// Bcrypt
// =============================================

// Pre-save Hook — Hash Password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (error) {
    throw error;
  }
});

// Instance Method — Compare Password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

// =============================================
// Patient Schema
// =============================================

const patientSchema = new mongoose.Schema(
  {
    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
    },

    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    emergencyContact: {
      name: {
        type: String,
        default: null,
      },

      phone: {
        type: String,
        default: null,
      },
    },

    // =============================================
    // Community Access
    // =============================================

    communityAccess: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    communityAccessDecidedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    communityAccessDecidedAt: {
      type: Date,
      default: null,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  }
);

// =============================================
// Patient Virtual
// =============================================

patientSchema.virtual("sessionHistory", {
  ref: "Session",
  localField: "_id",
  foreignField: "patientId",
});

// Create Patient Discriminator
const Patient = User.discriminator("patient", patientSchema);

// =============================================
// Doctor Schema
// =============================================

const doctorSchema = new mongoose.Schema({
  NationalId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  specialization: {
    type: String,
    required: [true, "Specialization is required."],
    trim: true,
  },

  licenseNumber: {
    type: String,
    required: [true, "License number is required."],
    trim: true,
  },

  certificate: {
    type: String,
    required: [true, "Certificate is required for doctor registration."],
  },

  bio: {
    type: String,
    maxlength: [500, "Bio must not exceed 500 characters."],
    default: null,
  },

  yearsOfExperience: {
    type: Number,
    min: [0, "Years of experience cannot be negative."],
    default: 0,
  },

  // =============================================
  // Doctor Approval
  // =============================================

  isApproved: {
    type: Boolean,
    default: false,
  },

  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  approvedAt: {
    type: Date,
    default: null,
  },

  sessionPrice: {
    type: Number,
    min: [0, "Session price cannot be negative."],
    default: 0,
  },

  slots: [
    {
      day: {
        type: Date,
        required: true,
      },

      time: {
        type: String,
        default: null,
      },

      location: {
        type: String,
        trim: true,
      },
    },
  ],
});

// Create Doctor Discriminator
const Doctor = User.discriminator("doctor", doctorSchema);

// =============================================
// Admin Schema
// =============================================

const adminSchema = new mongoose.Schema({
  permissions: {
    type: [String],
    enum: [
      "manage_users",
      "approve_doctors",
      "manage_content",
      "view_reports",
    ],
    default: ["manage_users", "approve_doctors"],
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
});

// Create Admin Discriminator
const Admin = User.discriminator("admin", adminSchema);

// =============================================
// Exports
// =============================================

module.exports = {
  User,
  Patient,
  Doctor,
  Admin,
};