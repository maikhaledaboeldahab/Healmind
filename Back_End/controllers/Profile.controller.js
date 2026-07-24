const { User , Doctor } = require("../models/User");
const { updateProfileSchema,updateDoctorProfileSchema} = require("../validation/Profile.validators");


// Update Profile
const updateProfile = async (req, res) => {
  try {
    // Joi Validation
    const { error, value } = updateProfileSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update data
    if (value.name !== undefined) user.name = value.name;
    if (value.email !== undefined) user.email = value.email;
    if (value.phone !== undefined) user.phone = value.phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email phone profileImage role isActive"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Doctor Profile
const updateDoctorProfile = async (req, res) => {
  try {
    // Joi Validation
    const { error, value } = updateDoctorProfileSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const doctor = await Doctor.findById(req.user.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    // Common fields
    if (value.name !== undefined) doctor.name = value.name;
    if (value.phone !== undefined) doctor.phone = value.phone;

    // Doctor fields
    if (value.specialization !== undefined)
      doctor.specialization = value.specialization;

    if (value.bio !== undefined)
      doctor.bio = value.bio;

    if (value.yearsOfExperience !== undefined)
      doctor.yearsOfExperience = value.yearsOfExperience;

    if (value.sessionPrice !== undefined)
      doctor.sessionPrice = value.sessionPrice;

    if (value.availableDays !== undefined)
      doctor.availableDays = value.availableDays;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully.",
      data: doctor,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update Profile Image
const updateProfileImage = async (req, res) => {
  try {
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Save image path
    user.profileImage = req.file.path;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      data: {
        profileImage: user.profileImage,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getProfile,
  updateProfile,
  updateProfileImage,
  updateDoctorProfile,
};