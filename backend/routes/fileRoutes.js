import express from "express";
import multer from "multer";
import isAuth from "../middlewares/isAuth.js";
import {
  uploadFile,
  getAllFiles,
  deleteFile,
  analyzeFileWithAI,
} from "../controllers/fileController.js";

const router = express.Router();

// Use multer in memory (since you’re uploading to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ROUTES
router.post("/upload", isAuth, upload.single("file"), uploadFile); // Upload report
router.get("/all", isAuth, getAllFiles); // Get all user reports
router.delete("/:fileId", isAuth, deleteFile); // Delete report
router.post("/analyze/:fileId", isAuth, analyzeFileWithAI); // AI Analysis

export default router;
