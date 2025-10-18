import express from "express";
import { getAllInsights, getSingleInsight } from "../controllers/aiInsightController.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/", isAuth, getAllInsights);
router.get("/:id", isAuth, getSingleInsight);

export default router;
