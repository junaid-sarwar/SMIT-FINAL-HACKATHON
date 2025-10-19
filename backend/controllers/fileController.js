import { File } from "../models/File.js";
import { AiInsight } from "../models/AiInsight.js";
import getDataUri from "../config/dataUri.js";
import cloudinary from "../config/cloudinary.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Tesseract from "tesseract.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
const pdf = (await import("pdf-parse")).default;

dotenv.config();

// ========== UPLOAD FILE ==========
export const uploadFile = async (req, res) => {
  try {
    const { reportType, notes, reportDate } = req.body;
    const userId = req.userId;

    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    const fileUri = getDataUri(req.file);
    const uploadedFile = await cloudinary.uploader.upload(fileUri.content, {
      resource_type: "raw",
      folder: "healthmate_reports",
    });

    const newFile = await File.create({
      user: userId,
      fileUrl: uploadedFile.secure_url,
      reportName: req.file.originalname,
      fileType: req.file.mimetype.includes("image") ? "image" : "pdf",
      date: reportDate || Date.now(),
      reportType: reportType || "general",
      notes: notes || "",
      publicId: uploadedFile.public_id,
    });

    return res.status(201).json({ success: true, message: "File uploaded successfully", file: newFile });
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

    if (file.publicId) await cloudinary.uploader.destroy(file.publicId, { resource_type: "raw" });
    await file.deleteOne();

    return res.status(200).json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ========== GEMINI AI ANALYSIS ==========
export const analyzeFileWithAI = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ success: false, message: "File not found" });

    const response = await fetch(file.fileUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    let extractedText = "";
    if (file.fileType === "pdf") {
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text;
    } else if (file.fileType === "image") {
      const { data: { text } } = await Tesseract.recognize(buffer, "eng");
      extractedText = text;
    }

    if (!extractedText.trim()) return res.status(400).json({ success: false, message: "Could not extract text from the file." });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are "HealthMate AI" — a professional health assistant.
Analyze this medical report text and respond in JSON:

{
  "englishSummary": "...",
  "urduSummary": "...",
  "abnormalValues": ["..."],
  "doctorQuestions": ["..."],
  "foodsToAvoid": ["..."],
  "recommendedFoods": ["..."],
  "homeRemedies": ["..."],
  "riskLevel": "Low | Medium | High | Critical",
  "disclaimer": "Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi."
}

Report Text:
"""
${extractedText}
"""
`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    let parsedData = {};
    try { parsedData = JSON.parse(text); } catch { parsedData = { englishSummary: text }; }

    const aiInsight = await AiInsight.create({
      user: file.user,
      file: file._id,
      englishSummary: parsedData.englishSummary || "No summary generated",
      urduSummary: parsedData.urduSummary || "Roman Urdu summary not available",
      abnormalValues: parsedData.abnormalValues || [],
      doctorQuestions: parsedData.doctorQuestions || [],
      foodsToAvoid: parsedData.foodsToAvoid || [],
      recommendedFoods: parsedData.recommendedFoods || [],
      homeRemedies: parsedData.homeRemedies || [],
      riskLevel: parsedData.riskLevel || "Low",
      disclaimer: parsedData.disclaimer || "Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi.",
    });

    return res.status(200).json({ success: true, message: "AI analysis completed successfully", aiInsight });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return res.status(500).json({ success: false, message: "Error analyzing report with Gemini" });
  }
};
