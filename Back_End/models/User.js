const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Session = require("../models/session.model");
// role is determined by the discriminatorKey "role" in the schema options
const userOptions = {
  discriminatorKey: "role",
  timestamps: true,
};

// base User Schema
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
      select: false, // Hide password from queries by default
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
      default: true, //for testing
    },
  }, userOptions
);



//!bycrpt
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

// Patient Schema (extends User)
const patientSchema = new mongoose.Schema({
  dateOfBirth: {
    type: Date,
    default: null,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  // Sessions and tests will be linked through other models
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

},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  });


//Enable virual
patientSchema.virtual("sessionHistory", {
  ref: "Session",       // The model to use
  localField: "_id",    // Find sessions where `patientId` matches the patient's `_id`
  foreignField: "patientId",
  // options: { sort: { scheduledTime: -1 } } // Optional: sort by latest sessions
});

const Patient = User.discriminator("patient", patientSchema);

// Doctor Schema (extends User)
const doctorSchema = new mongoose.Schema(
  {
    NationalId: { type: String, require: true, default: null, unique: true },
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
      type: String, // File path after upload using Multer
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
    isApproved: {
      type: Boolean,
      default: true, // Requires admin approval //need to be edited // this is true just for testing
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
        day: { type: Date, required: true, default: null },
        time: {
          type: String,
          required: false,
          default: null,
        },
        location: {
          type: String,
          required: [false, "Location is required."],
          trim: true,
        },
        isBooked: {
          type: Boolean,
          default: false,
        }
      },
    ],
  },
  { timestamps: true },
);
const Doctor = User.discriminator("doctor", doctorSchema);

// Admin Schema (extends User)
const adminSchema = new mongoose.Schema({
  permissions: {
    type: [String],
    enum: ["manage_users", "approve_doctors", "manage_content", "view_reports"],
    default: ["manage_users", "approve_doctors"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

const Admin = User.discriminator("admin", adminSchema);
module.exports = {
  User,
  Patient,
  Doctor,
  Admin,
};
