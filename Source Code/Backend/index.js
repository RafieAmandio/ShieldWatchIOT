const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/Auth.routes");
const { detectAndCompareFaces, sendEmail, handleJsonMessage } = require("./src/services/Algh.services");
const app = express();
const path = require("path");
const mqtt = require("mqtt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

const brokerUrl = "mqtt://broker.mqttdashboard.com";

const client = mqtt.connect(brokerUrl, {
  clientId: "BackendServer", // Choose a unique client ID
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

// const idCardImagePath = path.resolve(__dirname, "brad-pitt.jpg");
// const selfieImagePath = path.resolve(__dirname, "download.jpg");
// detectAndCompareFaces(idCardImagePath, selfieImagePath);

// sendEmail("rafieamandio@gmail.com");
// Routes used in the app
app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
