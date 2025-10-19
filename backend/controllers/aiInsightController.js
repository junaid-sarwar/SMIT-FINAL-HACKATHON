// controllers/aiInsightController.js
import { AiInsight } from "../models/AiInsight.js";

// 📜 Get All AI Insights (for dashboard/history)
export const getAllInsights = async (req, res) => {
  try {
    const insights = await AiInsight.find({ user: req.userId })
      .populate("file", "reportName fileUrl date familyMemberName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: insights.length,
      insights,
    });
  } catch (error) {
    console.error("Get Insights Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 📄 Get Single AI Insight by ID
export const getSingleInsight = async (req, res) => {
  try {
    const { id } = req.params;
    const insight = await AiInsight.findOne({
      _id: id,
      user: req.userId,
    }).populate("file", "reportName fileUrl date familyMemberName");

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: "Insight not found",
      });
    }

    return res.status(200).json({
      success: true,
      insight,
    });
  } catch (error) {
    console.error("Get Single Insight Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
