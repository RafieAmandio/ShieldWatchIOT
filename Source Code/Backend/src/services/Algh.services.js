const faceapi = require("face-api.js");
const { Canvas, Image, ImageData, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");
const { createTransport } = require("nodemailer");

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

async function renderFace(image, x, y, width, height) {
  const canvas = new Canvas(width, height);
  const context = canvas.getContext("2d");

  context.drawImage(image, x, y, width, height, 0, 0, width, height);

  const buffer = canvas.toBuffer("image/jpeg");
  fs.writeFileSync("output.jpg", buffer);
}

async function load(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

exports.sendEmail = async function sendEmail(toEmail) {
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

function convertBase64ToImage(clientId, base64String) {
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

exports.handleJsonMessage = async function handleJsonMessage(jsonMessage) {
  try {
    const parsedMessage = JSON.parse(jsonMessage);
    if (parsedMessage && parsedMessage.clientId && parsedMessage.payload) {
      const clientId = parsedMessage.clientId;
      const imageData = parsedMessage.payload;

      // Convert the received base64 data to an image
      const FileImage = convertBase64ToImage(clientId, imageData);
      const dist = await detectAndCompareFaces(FileImage, "./brad-pitt.jpg");
    } else {
      console.error(
        "Invalid JSON message format. Missing clientId or payload."
      );
    }
  } catch (error) {
    console.error("Error parsing JSON message:", error.message);
  }
};
