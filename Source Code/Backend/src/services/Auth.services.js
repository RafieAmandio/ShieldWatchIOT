const bcrypt = require("bcrypt");
const { User } = require("../models/user.model");

exports.register = async (body) => {
  console.log(body);
  const userData = body;

  if (!userData.username || !userData.email || !userData.password) {
    throw new Error("Missing required fields");
  }

  try {
    userData.password = await bcrypt.hash(userData.password, 10);

    const result = new User({
      username: userData.username,
      email: userData.email,
      password: userData.password,
    });
    await result.save();

    return { message: "Sucesss Creating New User!", result: result };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Could not create user");
  }
};

exports.login = async (body) => {
  try {
    const { email, password } = body;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }
    return { message: "Login successful", result: user };
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("Internal Server Error");
  }
};

exports.addPhoto = async (req) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (req.file) {
      // If a file is uploaded, update the file_path field in the user model
      user.file_path = req.file.path;

      // Save the updated user model
      await user.save();

      return { message: "File uploaded successfully", result: user };
    } else {
      throw new Error("No file uploaded");
    }
  } catch (error) {
    console.error("Error adding photo:", error.message);
    throw new Error("Internal Server Error");
  }
};
