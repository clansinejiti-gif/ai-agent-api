import { Router } from "express";
import { getCareerTracks, registerTrack } from "../controllers/careerController.js";
import requireAuth from "../middlewares/authMiddleware.js";
import { roleCheck } from "../middlewares/roleChecker.js";

const router = Router();

router.get("/tracks", requireAuth, getCareerTracks);

router.post('/track', roleCheck, registerTrack)

export default router;
