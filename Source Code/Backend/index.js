const express = require("express");
const cors = require("cors");
const db = require("./src/config/db");
const authRoutes = require("./src/routes/Auth.routes");
const deviceRoutes = require("./src/routes/Device.routes");
const {User} = require("./src/models/user.model")
const {
  handleJsonMessage,
  detectAndCompareFaces,
} = require("./src/utils/mqtt.utils");
const { sendEmail } = require("./src/services/Algh.services");
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
  clientId: "BackendServer2",
});

let isQueueProcessing = false;
// const dist =  detectAndCompareFaces(
//   "./profile/1702104152658-brad-pitt.jpg",
//   "./temp/image_ESPCAM_1702479099316.jpg"
// );
// console.log(dist);

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

  if (!isQueueProcessing) {
    isQueueProcessing = true;
    handleJsonMessage(message);
    isQueueProcessing = false;
  }
});

app.use("/auth", authRoutes);
app.use("/device", deviceRoutes);

app.post("/send-warning", async (req, res) => {
  try {
    const { warningMessage, email } = req.body;

    if (!warningMessage) {
      return res
        .status(400)
        .json({ error: "Missing warningMessage in the request body" });
    }
    sendEmail(email);

    // Publish the warning message to the MQTT topic
    client.publish(
      "ShieldWatchIOT",
      JSON.stringify({ type: "warning", message: warningMessage })
    );

    return res
      .status(200)
      .json({ success: true, message: "Warning sent successfully" });
  } catch (error) {
    console.error("Error sending warning:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function processQueue() {
  // Set the flag to indicate that the queue is being processed
  isQueueProcessing = true;

  // Process each message in the queue
  while (messageQueue.length > 0) {
    const { topic, message } = messageQueue.shift();
    console.log(message);

    // Call the function
    handleJsonMessage(message);
  }

  // Set the flag to indicate that the queue processing is complete
  isQueueProcessing = false;
}
