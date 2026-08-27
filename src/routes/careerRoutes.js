import { Router } from "express";
import { getCareerTracks, registerTrack } from "../controllers/careerController.js";
import requireAuth from "../middlewares/authMiddleware.js";
import { roleCheck } from "../middlewares/roleChecker.js";

const router = Router();

/**
 * @swagger
 
 * /api/v1/careers/tracks:
 *   get:
 *     summary: Retrieve career roadmaps
 *     tags: [Career]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: domain
 *         schema: { type: string }
 *         example: Software Engineering
 *     responses:
 *       200:
 *         description: Career tracks list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       trackId: { type: string, example: tr_backend_01 }
 *                       title: { type: string, example: Backend Engineering }
 *                       keySkills:
 *                         type: array
 *                         items: { type: string }
 *                         example: ["Node.js", "SQL/NoSQL", "System Design", "API Security"]
 *                       industryDemand: { type: string, example: High }
 */
router.get("/tracks", requireAuth, getCareerTracks);

router.post('/tracks', roleCheck, registerTrack)

export default router;
