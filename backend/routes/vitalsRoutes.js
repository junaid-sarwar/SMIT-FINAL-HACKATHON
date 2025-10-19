import express from "express";
import { addVitals, getVitalsHistory, getLatestVitals } from "../controllers/vitalsController.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/add", isAuth, addVitals);
router.get("/history", isAuth, getVitalsHistory);
router.get("/latest", isAuth, getLatestVitals); // new endpoint for dashboard

export default router;
