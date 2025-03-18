import cloudinary from "../cloudinary.js";

const deleteMedia = async (publicId, type) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
    });
    return "success";
  } catch (error) {
    console.log(error);
    return "error";
  }
};

export const deleteMedias = async (req, res) => {
  const publicIds = req.body;

  try {
    const deleteResults = await Promise.all(
      publicIds.map(({ publicId, type }) => deleteMedia(publicId, type))
    );
    const responses = deleteResults.some((result) => result === "error")
      ? "error"
      : "success";
    return res.status(200).json({ status: responses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: responses });
  }
};

export const deleteMediasOnError = async (publicIds) => {
  try {
    const deleteResults = await Promise.all(
      publicIds.map(({ publicId, type }) => deleteFile(publicId, type))
    );
    const responses = deleteResults.some((result) => result === "error")
      ? "error"
      : "success";

    if (responses === "error") deleteMediasOnError(publicIds);
  } catch (error) {
    console.log(error);
    deleteMediasOnError(publicIds);
  }
};
