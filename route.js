import { Router } from "express";
import { uploadCropedMedias } from "./controllers/uploadCropedMedias.js";
import { multerUpload } from "./multer.js";
import { deleteMedias } from "./controllers/delete.js";
import { ping } from "./controllers/ping.js";
import { uploadPosterImage } from "./controllers/uploadSingleImage.js";
import { deletePosterImage } from "./controllers/deletePosterImage.js";

const router = Router();

router.post(
  "/uploadCropedMedias",
  multerUpload.array("files", 100),
  uploadCropedMedias
);
router.post("/deleteMedias", deleteMedias);
router.post(
  "/uploadPosterImage",
  multerUpload.single("file"),
  uploadPosterImage
);
router.delete("/deletePosterImage/:publicId", deletePosterImage);
router.get("/ping", ping);

export default router;
