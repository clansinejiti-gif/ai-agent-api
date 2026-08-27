import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI Student Recommendation Engine API",
      version: "1.0.0",
      description: "Production-ready RESTful backend API",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5500}`,
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid",
          description: "Session-based cookie authentication",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "VALIDATION_ERROR" },
                message: {
                  type: "string",
                  example: "Invalid input parameters",
                },
                details: {
                  type: "array",
                  items: { type: "string" },
                  example: ["Field 'targetRole' is required."],
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js", './src/app.js'],
};

export const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password, role]
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Alex Morgan
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alex.morgan@university.edu
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
 *               role:
 *                 type: string
 *                 enum: [student, admin]
 *                 example: student
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Account created successfully }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: usr_10928 }
 *                     fullName: { type: string, example: Alex Morgan }
 *                     email: { type: string, example: alex.morgan@university.edu }
 *                     role: { type: string, example: student }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in and initiate session
 *     tags: [Authentication]
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
 *                 example: alex.morgan@university.edu
 *               password:
 *                 type: string
 *                 example: SecurePassword123!
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: connect.sid=s%3A...; Path=/; HttpOnly; Secure; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Login successful }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: usr_10928 }
 *                     email: { type: string, example: alex.morgan@university.edu }
 *                     role: { type: string, example: student }
 *
 * /api/v1/auth/logout:
 *   post:
 *     summary: Destroy active session
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Session terminated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Session terminated successfully }
 *
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current session user metadata
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Active session metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: usr_10928 }
 *                     email: { type: string, example: alex.morgan@university.edu }
 *                     role: { type: string, example: student }
 *                     sessionExpires: { type: string, format: date-time, example: "2026-08-24T12:00:00Z" }
 *
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
 *   put:
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
 *
 * /api/v1/books:
 *   get:
 *     summary: List books catalog with pagination and filtering
 *     tags: [Catalog]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         example: Backend
 *       - in: query
 *         name: skillLevel
 *         schema: { type: string }
 *         example: Intermediate
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         example: 10
 *     responses:
 *       200:
 *         description: Paginated book list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total: { type: integer, example: 18 }
 *                     page: { type: integer, example: 1 }
 *                     limit: { type: integer, example: 10 }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string, example: bk_101 }
 *                       title: { type: string, example: Designing Data-Intensive Applications }
 *                       author: { type: string, example: Martin Kleppmann }
 *                       category: { type: string, example: Backend }
 *                       skillLevel: { type: string, example: Intermediate }
 *                       tags:
 *                         type: array
 *                         items: { type: string }
 *                         example: ["distributed systems", "databases", "architecture"]
 *   post:
 *     summary: Add new book (Admin only)
 *     tags: [Catalog]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, author, category, skillLevel, tags]
 *             properties:
 *               title: { type: string, example: Clean Code }
 *               author: { type: string, example: Robert C. Martin }
 *               category: { type: string, example: Software Engineering }
 *               skillLevel: { type: string, example: Beginner }
 *               tags:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["refactoring", "best practices"]
 *     responses:
 *       201:
 *         description: Book created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: bk_102 }
 *                     title: { type: string, example: Clean Code }
 *
 * /api/v1/careers/tracks:
 *   get:
 *     summary: Retrieve career roadmaps
 *     tags: [Catalog]
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
 *
 * /api/v1/ai/recommendations:
 *   post:
 *     summary: Generate AI recommendations context payload
 *     tags: [AI Engine]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [focusArea, timeCommitmentHoursPerWeek, primaryGoal]
 *             properties:
 *               focusArea: { type: string, example: System Design }
 *               timeCommitmentHoursPerWeek: { type: integer, example: 10 }
 *               primaryGoal: { type: string, example: Prepare for junior backend developer interviews }
 *     responses:
 *       200:
 *         description: AI recommendation payload generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     recommendationId: { type: string, example: rec_88123 }
 *                     studentSummary:
 *                       type: object
 *                       properties:
 *                         major: { type: string, example: Computer Science }
 *                         targetRole: { type: string, example: Backend Developer }
 *                     recommendedBooks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string, example: bk_101 }
 *                           title: { type: string, example: Designing Data-Intensive Applications }
 *                           matchReason: { type: string, example: Directly aligns with your System Design focus area. }
 *                     careerAdvice:
 *                       type: object
 *                       properties:
 *                         focusArea: { type: string, example: System Design }
 *                         roadmapStep: { type: string, example: Focus on database indexing, distributed systems, and caching strategies over the next 4 weeks. }
 */
