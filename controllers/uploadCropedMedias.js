import cloudinary from "../cloudinary.js";
import { promises as fs } from "fs";
import { deleteMediasOnError } from "./delete.js";

const successUploads = [];

// This function computes the transformation parameters.
const getTransformation = (fileObj) => {
  const { cloudinarySize, originalSize, ratio, scale, size, position } =
    fileObj;

  // Compute basic parameters.
  const paramX = cloudinarySize.w / size.w;
  const paramY = cloudinarySize.h / size.h;

  // Compute the transformed width and height.
  // We use .toFixed() to convert the number to a string representing an integer.
  const computedWidth = (cloudinarySize.w / scale).toFixed();
  const computedHeight = (cloudinarySize.h / scale).toFixed();

  // Decide crop mode based on the height comparison.
  // Even if we change the crop mode to "scale", we always send computed height to have a defined value.
  const cropMode = cloudinarySize.h <= originalSize.h ? "crop" : "scale";

  // For non-crop cases, we can optionally apply aspect ratio.
  const aspectRatio =
    cloudinarySize.h > originalSize.h ? +ratio.toFixed(2) : undefined;

  // If scale is 1, adjust the x and y parameters.
  const x = scale === 1 ? (position.x * -1 * paramX).toFixed() : undefined;
  const y = scale === 1 ? (position.y * -1 * paramY).toFixed() : undefined;

  // When scale is greater than 1, you might want to center the gravity.
  const gravity = scale > 1 ? "center" : undefined;

  return {
    width: computedWidth,
    height: computedHeight,
    crop: cropMode,
    ...(aspectRatio !== undefined && { aspect_ratio: aspectRatio }),
    ...(x !== undefined && { x }),
    ...(y !== undefined && { y }),
    ...(gravity && { gravity }),
  };
};

// Upload a single media file.
const uploadMedia = async (fileObj) => {
  const { file } = fileObj;
  const { path, mimetype } = file;
  const type = mimetype.split("/")[0];

  try {
    const transformation = getTransformation(fileObj);

    const response = await cloudinary.uploader.upload(path, {
      resource_type: type === "image" ? "image" : "video",
      folder: "/Engage-Me",
      eager: [transformation],
      eager_async: true,
    });

    // Save info in case we need to delete on error.
    successUploads.push({
      publicId: response.public_id,
      type: response.resource_type,
    });

    return response;
  } catch (error) {
    console.error(`uploadMedia() error: ${error}`);
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

    // Prepare an array of objects containing each file and its additional parameters.
    const filesArray = files.map((file) => ({ file }));

    const body = req.body;
    const bodyArray = Object.entries(body);

    // For each key/value in req.body, parse and assign them into the corresponding file object.
    bodyArray.forEach(([key, value]) => {
      const isValueArray = Array.isArray(value);
      const array = isValueArray ? value : [value];

      array.forEach((item, index) => {
        // Parse JSON string into actual object.
        filesArray[index][key] = JSON.parse(item);
      });
    });

    // Map all file objects to an uploadMedia promise.
    const uploadPromises = filesArray.map((fileObj) => uploadMedia(fileObj));

    const results = await Promise.all(uploadPromises);

    // Prepare the media details for the response.
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

    // Remove the local files.
    await Promise.all(files.map((file) => fs.unlink(file.path)));

    // Clear the successUploads array.
    successUploads.length = 0;
    return res.status(200).json({ status: "success", medias });
  } catch (error) {
    console.error("Upload Failed:", error);
    deleteMediasOnError(successUploads);
    successUploads.length = 0;
    return res.status(500).json({ status: "error" });
  }
};
