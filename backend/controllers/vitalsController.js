// controllers/vitalsController.js
import { Vitals } from "../models/Vitals.js";

// ➕ Add New Vitals
export const addVitals = async (req, res) => {
  try {
    const { heartRate, bloodPressureSys, bloodPressureDia, temperature, weight } = req.body;

    if (!heartRate && !bloodPressureSys && !bloodPressureDia && !temperature && !weight) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one vital reading.",
      });
    }

    const newVitals = await Vitals.create({
      user: req.userId,
      heartRate,
      bloodPressureSys,
      bloodPressureDia,
      temperature,
      weight,
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
      history: vitals,
    });
  } catch (error) {
    console.error("Get Vitals Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 🔹 Get Latest Vitals
export const getLatestVitals = async (req, res) => {
  try {
    const latest = await Vitals.findOne({ user: req.userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      vitals: latest || {},
    });
  } catch (error) {
    console.error("Get Latest Vitals Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
