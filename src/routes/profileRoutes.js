import express from "express";
import { profileMe, profilePutMe } from "../controllers/profile.js";
import requireAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
  * /api/v1/profiles/me:
 *   get:
 *     summary: Retrieve student profile
 *     tags: [Profiles]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Student profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId: { type: string, example: usr_10928 }
 *                     academicLevel: { type: string, example: Undergraduate }
 *                     major: { type: string, example: Computer Science }
 *                     targetRole: { type: string, example: Backend Developer }
 *                     skills:
 *                       type: array
 *                       items: { type: string }
 *                       example: ["JavaScript", "Python"]
 *                     preferredGenres:
 *                       type: array
 *                       items: { type: string }
 *                       example: ["Software Architecture", "Career Growth"]
 *                     learningStyle: { type: string, example: Project-Based }
 */
router.get("/me", requireAuth, profileMe)

/**
 * @swagger
 *    put:
 *     summary: Update student profile
 *     tags: [Profiles]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               academicLevel: { type: string, example: Undergraduate }
 *               major: { type: string, example: Computer Science }
 *               targetRole: { type: string, example: Backend Developer }
 *               skills:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["JavaScript", "Node.js", "SQL"]
 *               preferredGenres:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["System Design", "Cloud Computing"]
 *               learningStyle: { type: string, example: Practical Project-Based }
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Profile updated successfully }
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedAt: { type: string, format: date-time, example: "2026-08-23T11:26:00Z" }
 */

router.put("/me", requireAuth, profilePutMe )

export default router;