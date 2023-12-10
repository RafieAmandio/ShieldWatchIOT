const mongoose = require("mongoose");

// Define the schema for the monitoring data
const monitoringSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["monitoring"],
      required: true,
    },
    device_id: {
      type: String,
      required: true,
    },
    ldr: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create the Monitoring model using the schema
const Monitoring = mongoose.model("Monitoring", monitoringSchema);

module.exports = Monitoring;
