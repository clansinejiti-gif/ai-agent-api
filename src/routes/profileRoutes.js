import express from "express";
import { profileMe } from "../controllers/profile.js";
import requireAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", requireAuth, profileMe)

export default router;