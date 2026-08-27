import {Router} from 'express';
import { getBooks, postBooks } from '../controllers/booksControllers.js';
import { roleCheck } from '../middlewares/roleChecker.js';
import requireAuth from '../middlewares/authMiddleware.js'

const router = Router();

/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     summary: List books catalog with pagination and filtering
 *     tags: [Books]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         example: Backend
 *       - in: query
 *         name: skillLevel
 *         schema:
 *           type: string
 *         example: Intermediate
 *     responses:
 *       200:
 *         description: Paginated book list
 *       401:
 *         description: Unauthorized
 */

router.get('/', requireAuth, getBooks)

/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     summary: Add new book (Admin only)
 *     tags: [Books]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - category
 *               - skillLevel
 *               - tags
 *             properties:
 *               title:
 *                 type: string
 *                 example: Clean Code
 *               author:
 *                 type: string
 *                 example: Robert C. Martin
 *               category:
 *                 type: string
 *                 example: Software Engineering
 *               skillLevel:
 *                 type: string
 *                 example: Beginner
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["refactoring", "best practices"]
 *     responses:
 *       201:
 *         description: Book created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */

router.post("/", roleCheck, postBooks);

export default router
