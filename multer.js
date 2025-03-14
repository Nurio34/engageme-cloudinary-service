import multer from "multer";

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const multerUpload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB file size limit
});
