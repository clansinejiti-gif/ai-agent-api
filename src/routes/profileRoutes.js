import express from "express";
import { profileMe, profilePutMe } from "../controllers/profile.js";
import requireAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", requireAuth, profileMe)
router.patch("/me", requireAuth, profilePutMe )

export default router;