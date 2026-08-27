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
        url: process.env.SWAGGER_LINK,
        description: "Development Server",
      },
    ],
    tags: [
      { name: "Authentication", description: "Auth & Session endpoints" },
      { name: "Profiles", description: "Student profile management" },
      { name: "Books", description: "Book catalog management" },
      { name: "Career", description: "Career tracks & roadmaps" },
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
  apis: ["./src/routes/*.js", "./src/app.js"],
};

export const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

 /**
 * @swagger
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
