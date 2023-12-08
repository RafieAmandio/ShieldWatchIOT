const express = require("express");
const cors = require("cors");
const db = require("./src/config/db");
const authRoutes = require("./src/routes/Auth.routes");
const deviceRoutes = require("./src/routes/Device.routes");
const { handleJsonMessage } = require("./src/services/Algh.services");
const dotenv = require("dotenv");
const app = express();
const mqtt = require("mqtt");

dotenv.config();
db.connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const brokerUrl = "mqtt://broker.mqttdashboard.com";

const client = mqtt.connect(brokerUrl, {
  clientId: "BackendServer",
});

client.on("connect", () => {
  console.log("Connected to MQTT server");
  client.subscribe("ShieldWatchIOT");
});

client.on("close", () => {
  console.log("Disconnected from MQTT server");
});

client.on("error", (err) => {
  console.error("Error:", err);
});

client.on("message", (topic, message) => {
  console.log(`Received message on topic ${topic}`);
  handleJsonMessage(message);
});

app.use("/auth", authRoutes);
app.use("/device", deviceRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
