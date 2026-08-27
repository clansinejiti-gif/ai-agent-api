import express from "express";
import { registerUser } from "../controllers/register.js";
import { login } from "../controllers/login.js";
import { logout } from "../controllers/logout.js";
import { authMe } from "../controllers/profile.js";
import requireAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password]
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Alex Morgan
 *               email:
 *                 type: string
 *                 example: alex.morgan@university.edu
 *               password:
 *                 type: string
 *                 example: SecurePassword123!
 *               role:
 *                 type: string
 *                 enum: [student, admin]
 *     responses:
 *       201:
 *         description: Account created successfully
 *       409:
 *         description: User already exists
 */

router.post("/register", registerUser);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in and start a session
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful — sets connect.sid cookie
 *       401:
 *         description: Invalid credentials
 */

router.post("/login", login);

router.post("/logout", logout);

router.get('/me', requireAuth, authMe)

export default router;
