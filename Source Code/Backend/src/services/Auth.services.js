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

    // Check if email and password are provided
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }

    // Passwords match, user is authenticated
    // Here you can generate a JWT token and send it back to the client
    // For simplicity, I'm just sending a success message for now
    return { message: "Login successful", result: user };
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("Internal Server Error");
  }
};
