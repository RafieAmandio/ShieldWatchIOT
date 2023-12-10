const authServices = require("../services/Auth.services");

exports.register = async function (req, res) {
  try {
    const result = await authServices.register(req);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async function login(req, res) {
  try {
    const result = await authServices.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.addPhoto = async function addPhoto(req, res) {
  try {
    const result = await authServices.addPhoto(req);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
