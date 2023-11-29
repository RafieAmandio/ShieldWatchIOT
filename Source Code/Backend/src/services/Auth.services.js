const admin = require("../config/firebase");
const bcrypt = require("bcrypt");


const db = admin.firestore();
const usersCollection = db.collection("users");

exports.createUser = async (req, res) => {
  const userData = req.body;

  // Add validation for the required fields
  if (
    !userData.Name ||
    !userData.DateOfBirth ||
    !userData.Address ||
    !userData.Phone
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Add validation for data types
  if (
    typeof userData.Name !== "string" ||
    !Number.isNaN(Date.parse(userData.DateOfBirth)) || // Check if DateOfBirth is a valid datetime
    typeof userData.Address !== "string" ||
    typeof userData.Phone !== "string"
  ) {
    return res.status(400).json({ error: "Invalid data types" });
  }

  try {
    // Hash the password before storing it
    const saltRounds = 10; // Adjust the number of salt rounds as needed
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    userData.password = hashedPassword;

    const docRef = await usersCollection.add(userData);
    return res.status(201).json({ id: docRef.id });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Could not create user" });
  }
};


