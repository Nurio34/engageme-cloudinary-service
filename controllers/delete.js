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

export const deleteMediasOnError = async (publicIds, retries = 3) => {
  if (retries <= 0) {
    console.error("Max retry attempts reached. Failed to delete media.");
    return;
  }

  try {
    const deleteResults = await Promise.all(
      publicIds.map(({ publicId, type }) => deleteFile(publicId, type))
    );

    const hasError = deleteResults.some((result) => result === "error");

    if (hasError) {
      console.warn(
        `Retrying deleteMediasOnError... Remaining attempts: ${retries - 1}`
      );
      await deleteMediasOnError(publicIds, retries - 1);
    }
  } catch (error) {
    console.error("Error deleting media:", error);
    console.warn(
      `Retrying deleteMediasOnError... Remaining attempts: ${retries - 1}`
    );
    await deleteMediasOnError(publicIds, retries - 1);
  }
};
