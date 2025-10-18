import express from "express";
import { addVitals, getVitalsHistory } from "../controllers/vitalsController.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/add", isAuth, addVitals);
router.get("/history", isAuth, getVitalsHistory);

export default router;
