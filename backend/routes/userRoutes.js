// routes/userRoutes.js
import express from "express";
import { register,login,logout, getUser } from "../controllers/userController.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/register", register);

// Login
router.post("/login", login);

router.get("/logout", logout);

router.get("/me", isAuth, getUser)

export default router;