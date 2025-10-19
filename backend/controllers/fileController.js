// controllers/fileController.js
import { File } from "../models/File.js";
import { AiInsight } from "../models/AiInsight.js";
import getDataUri from "../config/dataUri.js";
import cloudinary from "../config/cloudinary.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Tesseract from "tesseract.js";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// ========== UPLOAD FILE ==========
export const uploadFile = async (req, res) => {
  try {
    const { reportDate, familyMemberName } = req.body;
    const userId = req.userId;

    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    const fileUri = getDataUri(req.file);
    // Upload as raw (pdf/image) to Cloudinary
    const uploadedFile = await cloudinary.uploader.upload(fileUri.content, {
      resource_type: "raw",
      folder: "healthmate_reports",
    });

    // Save file in DB matching file model
    const newFile = await File.create({
      user: userId,
      fileUrl: uploadedFile.secure_url,
      reportName: req.file.originalname,
      fileType: req.file.mimetype.includes("image") ? "image" : "pdf",
      familyMemberName: familyMemberName || "Self",
      date: reportDate || Date.now(),
      // If you want to keep publicId later, add field to model and store uploadedFile.public_id
    });

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ========== GET ALL FILES ==========
export const getAllFiles = async (req, res) => {
  try {
    const userId = req.userId;
    const files = await File.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, files });
  } catch (error) {
    console.error("Get Files Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ========== DELETE FILE ==========
export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ success: false, message: "File not found" });

    // If you stored publicId in model in future, call cloudinary.uploader.destroy(publicId)
    await file.deleteOne();

    return res.status(200).json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ========== GEMINI AI ANALYSIS ==========
// This function extracts text (pdf or image), sends prompt to Gemini, saves AiInsight
export const analyzeFileWithAI = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ success: false, message: "File not found" });

    // Fetch the file content from Cloudinary
    const response = await fetch(file.fileUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    let extractedText = "";

    if (file.fileType === "pdf") {
      try {
        // Dynamic import to support ESM environments (pdf-parse is cjs)
        const { default: pdf } = await import("pdf-parse");
        const pdfData = await pdf(buffer);
        extractedText = pdfData.text || "";
      } catch (err) {
        console.error("PDF parsing failed:", err);
        return res.status(400).json({ success: false, message: "Error parsing PDF file" });
      }
    } else if (file.fileType === "image") {
      const {
        data: { text },
      } = await Tesseract.recognize(buffer, "eng");
      extractedText = text || "";
    }

    if (!extractedText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from the file.",
      });
    }

    // === Gemini / Generative AI call ===
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are "HealthMate AI" — a professional health assistant.

Analyze this medical report text and return ONLY valid JSON with these keys:
englishSummary, urduSummary, doctorQuestions, recommendedFoods, foodsToAvoid, homeRemedies, riskLevel.

Guidelines:
- Use short, clear sentences (max 2 lines each).
- Keep doctorQuestions concise and actionable (3–5 items only).
- Avoid generic or repeated questions.
- Urdu should be in Roman Urdu.
- Lists should be arrays.
- No markdown, no explanations, only valid JSON.

Report Text:
"""
${extractedText}
"""
`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    // Try to parse, but always save rawResponse too
    let parsedData = {};
    try {
      parsedData = JSON.parse(text);
    } catch (err) {
      // If not valid JSON, keep the raw text as englishSummary
      parsedData = { englishSummary: text };
    }

    // Map parsed fields to your AiInsight model fields:
    const englishSummary = parsedData.englishSummary || parsedData.summary || parsedData.text || "";
    const urduSummary = parsedData.urduSummary || parsedData.romanUrduSummary || "";
    const doctorQuestions = parsedData.doctorQuestions || parsedData.questions || [];
    // Map recommended foods to foodSuggestions field in model
    const foodSuggestions = parsedData.recommendedFoods || parsedData.foodSuggestions || parsedData.recommended || [];
    const homeRemedies = parsedData.homeRemedies || parsedData.remedies || [];
    const disclaimer = parsedData.disclaimer || "Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi.";

    // Save AI insight (store raw response as well)
    const aiInsight = await AiInsight.create({
      user: file.user,
      file: file._id,
      englishSummary: englishSummary || "No summary generated",
      urduSummary: urduSummary || "Roman Urdu summary not available",
      doctorQuestions: Array.isArray(doctorQuestions) ? doctorQuestions : [doctorQuestions],
      foodSuggestions: Array.isArray(foodSuggestions) ? foodSuggestions : [foodSuggestions],
      homeRemedies: Array.isArray(homeRemedies) ? homeRemedies : [homeRemedies],
      disclaimer,
      rawResponse: parsedData || { rawText: text },
    });

    return res.status(200).json({
      success: true,
      message: "AI analysis completed successfully",
      aiInsight,
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error analyzing report with Gemini",
    });
  }
};
