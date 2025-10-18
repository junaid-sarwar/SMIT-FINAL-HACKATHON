//controllers/userControllers.js
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../config/dataUri.js";
import cloudinary from "../config/cloudinary.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    // Check for missing fields
    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // Response
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // Send response
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        success: true,
        message: `Welcome back, ${user.fullName}`,
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    // Clear the token cookie by setting it to empty and expiring it immediately
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        sameSite: "strict",
        expires: new Date(0), // expire immediately
      })
      .json({
        success: true,
        message: "Logged out successfully.",
      });
  } catch (error) {
    console.error("Logout Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// GET LOGGED-IN USER
export const getUser = async (req, res) => {
  try {
    // req.user.id will come from the auth middleware
    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    return res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("GetUser Error:", error)
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" })
  }
}
