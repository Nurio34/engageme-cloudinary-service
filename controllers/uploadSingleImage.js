import cloudinary from "../cloudinary.js";
import { unlinkSync } from "fs";
export const uploadPosterImage = async (req, res) => {
  const file = req.file;
  let timeout;

  try {
    clearTimeout(timeout);
    const media = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
    });

    unlinkSync(file.path);

    return res.status(200).json({
      status: "success",
      media: { url: media.url, publicId: media.public_id },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error" });
  }
};
