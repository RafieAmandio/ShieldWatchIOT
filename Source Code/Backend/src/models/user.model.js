const mongoose = require("mongoose");
const { deviceSchema } = require("./device.model");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },
  device: { type: [deviceSchema], required: false },
  file_path: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = {
  userSchema,
  User,
};
