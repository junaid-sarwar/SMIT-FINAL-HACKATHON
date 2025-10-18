import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import vitalsRoutes from "./routes/vitalsRoutes.js";
import aiInsightRoutes from "./routes/aiInsightRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow requests from your React frontend
app.use(
  cors({
    origin: "http://localhost:5173", // React app origin
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ REST API Routes
app.use("/api/user", userRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/vitals", vitalsRoutes);
app.use("/api/insights", aiInsightRoutes);

app.get("/", (req, res) => {
  res.status(200).send("✅ HealthMate AI Backend Running");
});

app.listen(PORT, "0.0.0.0", () => {
  connectDB();
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
