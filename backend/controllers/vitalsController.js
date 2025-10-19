// controllers/vitalsController.js
import { Vitals } from "../models/Vitals.js";

// ➕ Add New Vitals
export const addVitals = async (req, res) => {
  try {
    const { familyMemberName, bp, sugar, weight, notes, date } = req.body;

    if (!bp && !sugar && !weight && !notes) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one vital reading.",
      });
    }

    const newVitals = await Vitals.create({
      user: req.userId,
      familyMemberName: familyMemberName || "Self",
      bp: bp || "",
      sugar: typeof sugar === "number" ? sugar : sugar ? Number(sugar) : null,
      weight: typeof weight === "number" ? weight : weight ? Number(weight) : null,
      notes: notes || "",
      date: date ? new Date(date) : Date.now(),
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

// 📜 Get All Vitals History (optionally filter by familyMemberName)
export const getVitalsHistory = async (req, res) => {
  try {
    const { familyMemberName } = req.query;
    const filter = { user: req.userId };
    if (familyMemberName) filter.familyMemberName = familyMemberName;

    const vitals = await Vitals.find(filter).sort({ createdAt: -1 });

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

// 🔹 Get Latest Vitals (optionally per family member)
export const getLatestVitals = async (req, res) => {
  try {
    const { familyMemberName } = req.query;
    const filter = { user: req.userId };
    if (familyMemberName) filter.familyMemberName = familyMemberName;

    const latest = await Vitals.findOne(filter).sort({ createdAt: -1 });

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
