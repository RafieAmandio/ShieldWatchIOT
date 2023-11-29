const AlghServices = require("../services/Algh.services");



exports.compare = async function compare(req, res) {
  const file = req.file;
  const filename = req.body.filename;

  try {
    const comparisonResult = await faceapiService.compareFaces(
      file.path,
      filename
    );
    res.json({ result: comparisonResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


