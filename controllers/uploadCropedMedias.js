import cloudinary from "../cloudinary.js";
import { unlinkSync } from "fs";
import { deleteMediasOnError } from "./delete.js";

const successUploads = [];

const uploadMedia = async (fileObj) => {
  const { file, cloudinarySize, originalSize, ratio, scale, size, position } =
    fileObj;
  const { path, mimetype } = file;
  const type = mimetype.split("/")[0];

  const paramX = cloudinarySize.w / size.w;
  const paramY = cloudinarySize.h / size.h;

  try {
    const response = await cloudinary.uploader.upload(path, {
      resource_type: type === "image" ? "image" : "video",
      folder: "/Engage-Me",
      eager: [
        {
          width: (cloudinarySize.w / scale).toFixed(),
          height:
            cloudinarySize.h <= originalSize.h
              ? (cloudinarySize.h / scale).toFixed()
              : undefined,
          crop: cloudinarySize.h <= originalSize.h ? "crop" : "scale",
          aspect_ratio:
            cloudinarySize.h <= originalSize.h ? undefined : +ratio.toFixed(2),
          gravity: scale > 1 ? "center" : undefined,
          x: scale === 1 ? (position.x * -1 * paramX).toFixed() : undefined,
          y: scale === 1 ? (position.y * -1 * paramY).toFixed() : undefined,
        },
      ],
      eager_async: true,
    });
    successUploads.push({
      publicId: response.public_id,
      type: response.resource_type,
    });
    return response;
  } catch (error) {
    console.error(`uploadMedia() error : ${error} `);
    throw error;
  }
};

export const uploadCropedMedias = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "No files uploaded" });
    }

    const filesArray = files.map((file) => ({ file }));

    const body = req.body;
    const bodyArray = Object.entries(body);

    bodyArray.forEach(([key, value]) => {
      const isValueArray = Array.isArray(value);
      const array = isValueArray ? value : [value];

      array.forEach((item, index) => {
        filesArray[index][key] = JSON.parse(item);
      });
    });
    const uploadPromises = filesArray.map((fileObj) => uploadMedia(fileObj));

    const results = await Promise.all(uploadPromises);

    const medias = results.map((result) => ({
      asset_id: result.asset_id,
      public_id: result.public_id,
      version_id: result.version_id,
      url: result.url,
      secure_url: result.secure_url,
      format: result.format,
      resource_type: result.resource_type,
      width: result.width,
      height: result.height,
      duration: result.duration,
      eager: result.eager,
      audio: result.audio,
    }));

    files.forEach((file) => {
      unlinkSync(file.path);
    });
    successUploads.length = 0;
    return res.status(200).json({ status: "success", medias });
  } catch (error) {
    console.error("Upload Failed:", error);
    deleteMediasOnError(successUploads);
    successUploads.length = 0;
    return res.status(500).json({
      status: "error",
    });
  }
};
