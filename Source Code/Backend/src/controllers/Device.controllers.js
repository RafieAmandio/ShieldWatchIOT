const deviceServices = require("../services/Device.services");

exports.addDevice = async function (req, res) {
  try {
    const result = await deviceServices.addDevice(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.latest = async function (req, res) {
  try {
    const result = await deviceServices.latest(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
