// models/aiInsightModel.js
import mongoose from "mongoose";

const aiInsightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: true,
    },
    englishSummary: {
      type: String,
      required: true,
      trim: true,
    },
    urduSummary: {
      type: String,
      required: true,
      trim: true,
    },
    doctorQuestions: {
      type: [String],
      default: [],
    },
    foodSuggestions: {
      type: [String],
      default: [],
    },
    homeRemedies: {
      type: [String],
      default: [],
    },
    disclaimer: {
      type: String,
      default: "Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi.",
    },
  },
  { timestamps: true }
);

export const AiInsight = mongoose.model("AiInsight", aiInsightSchema);
