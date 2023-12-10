const faceapi = require("face-api.js");
const { Canvas, Image, ImageData, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");
const { createTransport } = require("nodemailer");
const mqtt = require("mqtt");
const { User } = require("../models/user.model");
const Monitoring = require("../models/monitoring.model");

const packetStore = new Map();

async function sendEmail(toEmail) {
  await transporter.sendMail({
    from: "info@smarthomeguardian.com",
    to: toEmail,
    subject: "There is Someone Outside",
    html: `
      Testing
      `,
  });
};

const transporter = createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "rafieamandio@gmail.com",
    pass: "EBR4mdYO6sgCNkay",
  },
});

exports.handleJsonMessage = async function handleJsonMessage(jsonMessage) {
  try {
    const parsedMessage = JSON.parse(jsonMessage);
    if (parsedMessage && parsedMessage.type) {
      const type = parsedMessage.type;

      if (type == "warning") {
        console.log("[Incoming] Monitoring / Warning Message ");
      } else if (type == "monitoring") {
        const monitoringData = new Monitoring({
          type: parsedMessage.type,
          device_id: parsedMessage.device_id,
          ldr: parsedMessage.ldr,
          temperature: parsedMessage.temperature,
          humidity: parsedMessage.humidity,
        });

        await monitoringData.save();
        console.log(
          `[Monitoring] Successfully save monitoring value ${parsedMessage.device_id} `
        );
      } else if (type == "capture") {
        const deviceId = parsedMessage.deviceId;
        const packetNo = parsedMessage.packet_no;
        const sck = parsedMessage.sck;
        const tsck = parsedMessage.tsck;
        const payload = parsedMessage.payload;

        // Create or get the entry for the current deviceId and packetNo
        const packetKey = `${deviceId}_${packetNo}`;
        let packetEntry = packetStore.get(packetKey) || {
          deviceId,
          packetNo,
          payload: [],
        };

        packetEntry.payload.push(payload);

        // Check if all packets are received for the current deviceId and packetNo
        if (sck === tsck) {
          // Combine payloads into a complete packet
          const completePacket = {
            deviceId: packetEntry.deviceId,
            packetNo: packetEntry.packetNo,
            payload: packetEntry.payload.join(""), // Combine payloads
          };

          // Send the complete packet to another function for processing
          await processCompletePacket(completePacket);

          packetStore.delete(packetKey);
        } else {
          packetStore.set(packetKey, packetEntry);
        }
      }
    } else {
      console.error("Invalid JSON message format. Missing type or .");
    }
  } catch (error) {
    console.error("Error parsing JSON message:", error.message);
  }
};

async function processCompletePacket(completePacket) {
  // Implement your logic to process the complete packet here
  console.log("Received complete packet:", completePacket);

  const imageReceived = await convertBase64ToImage(
    completePacket.deviceId,
    completePacket.payload
  );

  const imageFromDatabase = await findUserByDeviceId(completePacket.deviceId);
  console.log(imageFromDatabase);
  console.log(imageReceived);
  const dist = await detectAndCompareFaces(imageReceived, imageFromDatabase);

  if (dist > 0.6) {
    const user = await User.findOne({
      "device.device_id": completePacket.deviceId,
    });
    await sendEmail(user.email);

    if (user) {
      const monitoringDevices = user.device.filter(
        (device) => device.type === "MONITORING"
      );

      if (monitoringDevices.length > 0) {
        const mqttClient = mqtt.connect("mqtt://broker.mqttdashboard.com", {
          clientId: "BackendMabar",
        });

        mqttClient.on("connect", () => {
          monitoringDevices.forEach((monitoringDevice) => {
            const warningPayload = {
              type: "warning",
              device_id: monitoringDevice.device_id,
              message: "High distance detected!",
            };

            // Publish the JSON payload as a string
            mqttClient.publish(
              "ShieldWatchIOT",
              JSON.stringify(warningPayload)
            );
          });

          mqttClient.end();
        });
      }
    }
  }
}

async function findUserByDeviceId(deviceId) {
  try {
    const user = await User.findOne({ "device.device_id": deviceId });
    console.log(user);

    if (user) {
      return user.file_path;
    } else {
      console.error("Device Not Found");
      throw new Error("Device Not Found");
    }
  } catch (error) {
    // Handle any errors that occur during the search
    console.error("Error finding user by device_id:", error.message);
    throw error;
  }
}

async function convertBase64ToImage(clientId, base64String) {
  const tempFolder = "./temp";
  const fileName = `image_${clientId}_${Date.now()}.jpg`;

  const filePath = path.join(tempFolder, fileName);

  try {
    const imageBuffer = Buffer.from(base64String, "base64");

    fs.writeFileSync(filePath, imageBuffer, "binary");
    const filePath2 = `./temp/${fileName}`;
    console.log(`Image saved to ${filePath}`);
    return filePath2;
  } catch (error) {
    console.error("Error converting base64 to image:", error.message);
  }
}

async function detectAndCompareFaces(basePhotoPath, intruderPhotoPath) {
  try {
    const modelsPath = path.resolve(__dirname, "../models");
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath);
    await faceapi.nets.tinyFaceDetector.loadFromDisk(modelsPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath);
    await faceapi.nets.faceExpressionNet.loadFromDisk(modelsPath);

    const basePhotoImage = await load(basePhotoPath);
    const intruderPhotoImage = await load(intruderPhotoPath);

    const basePhotoDetection = await faceapi
      .detectSingleFace(basePhotoImage, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    const intruderPhotoDetection = await faceapi
      .detectSingleFace(
        intruderPhotoImage,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (basePhotoDetection && intruderPhotoDetection) {
      const distance = faceapi.euclideanDistance(
        basePhotoDetection.descriptor,
        intruderPhotoDetection.descriptor
      );
      console.log("Euclidean Distance:", distance);
      return distance;
    }
  } catch {
    console.error(error);
  }
}

async function load(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
