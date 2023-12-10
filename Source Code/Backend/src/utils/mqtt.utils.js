const faceapi = require("face-api.js");
const { Canvas, Image, ImageData, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");
const { createTransport } = require("nodemailer");

const packetStore = new Map();

exports.handleJsonMessage = async function handleJsonMessage(jsonMessage) {
  try {
    const parsedMessage = JSON.parse(jsonMessage);
    if (parsedMessage && parsedMessage.type) {
      const type = parsedMessage.type;

      if (type == "monitoring" || type == "warning") {
        console.log("[Incoming] Monitoring / Warning Message ");
      } else if (type == "capture") {
        const deviceId = parsedMessage.deviceId;
        const packetNo = parsedMessage.packet_no;
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
        if (packetEntry.payload.length === packetNo) {
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
      console.error(
        "Invalid JSON message format. Missing deviceId or payload."
      );
    }
  } catch (error) {
    console.error("Error parsing JSON message:", error.message);
  }
};

async function processCompletePacket(completePacket) {
  // Implement your logic to process the complete packet here
  console.log("Received complete packet:", completePacket);

  const imageReceived = convertBase64ToImage(completePacket.payload);
  const imageFromDatabase = findUserByDeviceId(completePacket.deviceId);
  const dist = await detectAndCompareFaces(imageReceived, imageFromDatabase);

  if (dist > 0.7) {
  }
}

async function findUserByDeviceId(deviceId) {
  try {
    const user = await User.findOne({ "device.device_id": deviceId });

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
  // Generate a unique filename
  const tempFolder = "./temp";
  const fileName = `image_${clientId}_${Date.now()}.png`;

  // Construct the file path
  const filePath = path.join(tempFolder, fileName);

  try {
    // Convert base64 to binary
    const imageBuffer = Buffer.from(base64String, "base64");

    fs.writeFileSync(filePath, imageBuffer, "binary");

    console.log(`Image saved to ${filePath}`);
    return filePath;
  } catch (error) {
    console.error("Error converting base64 to image:", error.message);
  }
}

async function detectAndCompareFaces(basePhotoPath, intruderPhotoPath) {
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
    .detectSingleFace(intruderPhotoImage, new faceapi.TinyFaceDetectorOptions())
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
}
