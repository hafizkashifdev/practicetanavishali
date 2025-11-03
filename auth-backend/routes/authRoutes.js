import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Temporary array to store refresh tokens (in real apps, store in DB)
let refreshTokens = [];

// ====================== SIGNUP ======================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const accessToken = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "60s" }
    );

    const refreshToken = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    refreshTokens.push(refreshToken);

    res.status(201).json({
      message: "User created successfully",
      accessToken,
      refreshToken,
      expiresIn: "30 seconds",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ====================== LOGIN ======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    refreshTokens.push(refreshToken);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      expiresIn: "30 seconds",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ====================== REFRESH TOKEN ======================
router.post("/refresh", (req, res) => {
  const { token } = req.body;

  if (!token)
    return res.status(401).json({ message: "No refresh token provided" });
  if (!refreshTokens.includes(token))
    return res.status(403).json({ message: "Invalid refresh token" });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Token expired or invalid" });

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30s" }
    );

    res.status(200).json({
      accessToken: newAccessToken,
      expiresIn: "30 seconds",
    });
  });
});

// ====================== LOGOUT ======================
router.post("/logout", (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.status(200).json({ message: "Logged out successfully" });
});

// ====================== GET ALL USERS ======================
router.get("/users", verifyToken, async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

export default router;
