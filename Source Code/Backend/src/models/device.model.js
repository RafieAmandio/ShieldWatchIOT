const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  device_name: { type: String, required: true },
  device_id: { type: String, required: true },
  type: {
    type: String,
    enum: ["CAMERA", "MONITORING"],
    required: false,
  },
});

const Device = mongoose.model("Device", deviceSchema);

module.exports = {
  deviceSchema,
  Device,
};
