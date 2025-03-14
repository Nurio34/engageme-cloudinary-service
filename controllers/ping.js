export const ping = async (req, res) => {
  try {
    console.log("ping ...");
    return res.status(200).send("success");
  } catch (error) {
    console.log(`Unexpected error : ${error}`);
    return res.status(500).send("error");
  }
};
