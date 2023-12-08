const { User } = require("../models/user.model");

exports.getAllDevices = async (body) => {
  const { userId } = body;
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return { message: "Device Found", result: user.device };
};

exports.addDevice = async (body) => {
  const { userId, device_name, device_id, type } = body;

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const newDevice = { device_name, device_id, type };
  user.device.push(newDevice);

  await user.save();

  return {
    message: "Device added successfully",
    result: newDevice,
  };
};
