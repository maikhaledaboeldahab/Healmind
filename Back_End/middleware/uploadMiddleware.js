const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");

// Store uploaded files temporarily in memory
const storage = multer.memoryStorage();

// Certificate file validation
const certificateFilter = (req, file, cb) => {
  const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed."
      ),
      false
    );
  }
};

// Profile image validation
const imageFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid image format. Only JPG, JPEG, PNG, and WEBP images are allowed."
      ),
      false
    );
  }
};

// Certificate upload
const uploadCertificateMulter = multer({
  storage,
  fileFilter: certificateFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("certificate");

// Profile image upload
const uploadProfileImageMulter = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
}).single("profileImage");

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
};

// Certificate middleware
const uploadCertificate = (req, res, next) => {
  uploadCertificateMulter(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Certificate size cannot exceed 5 MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message: `File upload error: ${err.message}`,
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return next();
    }

    try {
      const ext = path.extname(req.file.originalname).toLowerCase();

      // PDFs need raw resource type
      const resourceType = ext === ".pdf" ? "raw" : "image";

      const result = await uploadToCloudinary(
        req.file.buffer,
        "healmind/certificates",
        resourceType
      );

      req.file.cloudinaryUrl = result.secure_url;
      req.file.cloudinaryPublicId = result.public_id;

      next();
    } catch (error) {
      console.error("Cloudinary certificate upload error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to upload certificate to Cloudinary.",
      });
    }
  });
};

// Profile image middleware
const uploadProfileImage = (req, res, next) => {
  uploadProfileImageMulter(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Profile image size cannot exceed 2 MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message: `File upload error: ${err.message}`,
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return next();
    }

    try {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "healmind/profiles",
        "image"
      );

      req.file.cloudinaryUrl = result.secure_url;
      req.file.cloudinaryPublicId = result.public_id;

      next();
    } catch (error) {
      console.error("Cloudinary profile upload error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to upload profile image to Cloudinary.",
      });
    }
  });
};

module.exports = {
  uploadCertificate,
  uploadProfileImage,
};