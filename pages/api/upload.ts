export default async (req, res) => {
  try {
    res.status(200).json({ message: "success" });
    return null; // return uloaded file id here
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
