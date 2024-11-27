import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const fileExtension = file.mimetype.split("/")[1]; // Dynamically get the file type
    return {
      folder: "uploads",
      format: fileExtension, // Use the uploaded file's format
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

// Multer middleware
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      const error = new Error(
        "Invalid file type. Only JPEG and PNG are allowed.",
      );
      cb(error as any, false); // Cast error to any to avoid the type mismatch
    }
  },
});

export default upload;
