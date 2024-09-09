const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");

const { generateAccessToken, encrypt } = require("../utils/jwtUtils");
const { validationResult, matchedData } = require("express-validator");
const { ENCRYPTION_KEY_TEXT } = require("../config");

exports.register = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });

  const { email, password } = matchedData(req);

  try {
    const existedUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existedUser) {
      return res.status(409).json({ error: "User with email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const apiKeyEncrypted = encrypt(ENCRYPTION_KEY_TEXT);

    const user = await prisma.user.create({
      data: { email, password_hash: hashedPassword, apiKey: apiKeyEncrypted },
    });

    const accessToken = generateAccessToken(user.id);

    user.access_token = accessToken;

    const { password_hash: _, apiKey, ...userWithoutPassword } = user;

    return res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "User registration failed" });
  }
};

exports.login = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });

  const { email, password } = matchedData(req);

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).json({ error: "Incorrect email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect email or password" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);

    const { password_hash: _, apiKey, ...userWithoutPassword } = user;

    //options for cookie
    // const options = {
    //   httpOnly: true,
    //   sameSite: "None",
    //   secure: true,
    // };
    return (
      res
        .status(200)
        // .cookie("accessToken", accessToken, options)
        .json({
          message: "Login successful",
          access_token: accessToken,
          user: userWithoutPassword,
        })
    );
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Login failed" });
  }
};

exports.logout = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ error: "Bad request" });
  }

  // const options = {
  //   httpOnly: true,
  //   sameSite: "None",
  //   secure: true,
  // };

  return (
    res
      .status(200)
      // .clearCookie("accessToken", options)
      .json({ message: "User logged out" })
  );
};
exports.getUserDetails = async (req, res) => {
  const user = req.user;

  try {
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const userApiKey = await prisma.user.findUnique({
      where: { email: user.email },
      select: {
        apiKey: true,
        email: true,
      },
    });

    if (!userApiKey) {
      return res.status(400).json({ error: "User not found" });
    }

    return res.status(200).json(userApiKey);
  } catch (error) {
    console.error("Error fetching user details", error);
    return res.status(500).json({ error: "Failed to fetch user details" });
  }
};
