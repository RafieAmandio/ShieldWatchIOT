const { User } = require("../models/user.model");
const Monitoring = require("../models/monitoring.model");

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

exports.latest = async (body) => {
  const device_id = body.device_id;
  try {
    // Find the latest monitoring data based on the device ID, sorted by createdAt in descending order
    const latestMonitoringData = await Monitoring.findOne({ device_id })
      .sort({ createdAt: -1 })
      .exec();

    if (!latestMonitoringData) {
      throw new Error("Monitoring data not found for the device ID");
    }

    return latestMonitoringData;
  } catch (error) {
    console.error("Error fetching latest monitoring data:", error);
    throw new Error("Internal Server Error");
  }
};
