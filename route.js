import { Router } from "express";
import { uploadCropedMedias } from "./controllers/uploadCropedMedias.js";
import { multerUpload } from "./multer.js";
import { deleteMedias } from "./controllers/delete.js";
import { ping } from "./controllers/ping.js";
import { uploadSingleImage } from "./controllers/uploadSingleImage.js";

const router = Router();

router.post(
  "/uploadCropedMedias",
  multerUpload.array("files", 100),
  uploadCropedMedias
);
router.post("/deleteMedias", deleteMedias);
router.post(
  "/uploadSingleImage",
  multerUpload.single("file"),
  uploadSingleImage
);
router.get("/ping", ping);

export default router;
