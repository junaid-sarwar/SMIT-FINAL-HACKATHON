// controllers/vitalsController.js
import { Vitals } from "../models/Vitals.js";

// ➕ Add New Vitals
export const addVitals = async (req, res) => {
  try {
    const { bp, sugar, weight, notes } = req.body;

    if (!bp && !sugar && !weight) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one vital reading.",
      });
    }

    const newVitals = await Vitals.create({
      user: req.userId,
      bp,
      sugar,
      weight,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Vitals added successfully",
      vitals: newVitals,
    });
  } catch (error) {
    console.error("Add Vitals Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 📜 Get All Vitals History
export const getVitalsHistory = async (req, res) => {
  try {
    const vitals = await Vitals.find({ user: req.userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      vitals,
    });
  } catch (error) {
    console.error("Get Vitals Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
