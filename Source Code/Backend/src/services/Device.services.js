
const { User, userSchema} = require("../models/user.model")

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