import { Router } from "express";
import { getCareerTracks } from "../controllers/careerController.js";
import requireAuth from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/tracks", requireAuth, getCareerTracks);

export default router;
