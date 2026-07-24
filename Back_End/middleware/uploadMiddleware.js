const multer = require("multer");
const path = require("path");
const fs = require("fs");


const certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/certificates");

    // Create the folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, `cert-${uniqueSuffix}${ext}`);
  },
});


const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/profiles");

    // Create the folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, `profile-${uniqueSuffix}${ext}`);
  },
});


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


const uploadCertificate = multer({
  storage: certificateStorage,
  fileFilter: certificateFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum file size: 5 MB
  },
}).single("certificate"); // Form field name

const uploadProfileImage = multer({
  storage: profileImageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // Maximum file size: 2 MB
  },
}).single("profileImage");


const handleMulterError = (uploadFn) => {
  return (req, res, next) => {
    uploadFn(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message:
              "File size exceeded the limit. Maximum size is 5 MB for certificates and 2 MB for profile images.",
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

      next();
    });
  };
};

module.exports = {
  uploadCertificate: handleMulterError(uploadCertificate),
  uploadProfileImage: handleMulterError(uploadProfileImage),
};