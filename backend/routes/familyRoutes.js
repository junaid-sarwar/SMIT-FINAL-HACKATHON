import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { addFamilyMember, updateFamilyMember } from "../controllers/familyMemberController.js";

const router = express.Router();

router.post("/add", isAuth, addFamilyMember);
router.put("/update/:memberId", isAuth, updateFamilyMember);

export default router;
