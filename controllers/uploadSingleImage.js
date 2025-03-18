import cloudinary from "../cloudinary.js";

export const uploadSingleImage = async (req, res) => {
  const file = req.file;
  let timeout;

  try {
    clearTimeout(timeout);
    const media = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
    });
    res.status(200).json({ status: "success", media: media.url });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error" });
  }
};
