import cloudinary from "../cloudinary.js";

export const deletePosterImage = async (req, res) => {
  const { folder, id } = req.params;
  const publicId = folder + "/" + id;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    return res.status(200).json({ status: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error" });
  }
};
