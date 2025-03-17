import { Router } from "express";
import { uploadMedias } from "./controllers/upload.js";
import { multerUpload } from "./multer.js";
import { deleteMedias } from "./controllers/delete.js";
import { ping } from "./controllers/ping.js";

const router = Router();

router.post("/uploadMedias", multerUpload.array("files", 100), uploadMedias);
router.post("/deleteMedias", deleteMedias);
router.get("/ping", ping);

export default router;
