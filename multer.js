import multer from "multer";
// import path from "path";

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
    // let ext = path.extname(file.originalname); // Get original extension
    // if (!ext) {
    //   // If no extension, default to .png (or use mimetype)
    //   const mimeExt = file.mimetype.split("/")[1]; // Extract extension from mimetype
    //   ext = mimeExt ? `.${mimeExt}` : ".png";
    // }
    // cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

export const multerUpload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB file size limit
});
