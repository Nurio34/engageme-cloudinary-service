import { promises as fs } from "fs";
import cloudinary from "../cloudinary.js";

export const uploadEditedMedia = async (req, res) => {
  const { publicId } = req.body;
  const file = req.file;

  if (!file)
    return res
      .status(400)
      .json({ status: "error", message: "No file uploaded" });

  try {
    // Upload to Cloudinary
    const media = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
      public_id: publicId, // Ensure the same publicId is used
      overwrite: true, // Allow overwriting
    });

    if (!media) {
      await fs.unlink(file.path); // Unlink file if Cloudinary response is invalid
      return res.status(404).json({ status: "error" });
    }

    const { public_id, secure_url, width, height } = media;

    // Unlink the file after a successful upload
    await fs.unlink(file.path);

    return res.status(200).json({
      status: "success",
      media: { publicId: public_id, url: secure_url, width, height },
    });
  } catch (error) {
    console.error("Upload Failed:", error);

    // Unlink the file in case of an error
    await fs
      .unlink(file.path)
      .catch((err) => console.error("Unlink Error:", err));

    return res.status(500).json({ status: "error", message: error.message });
  }
};
