import express from "express";
import errorHandler from "../src/middlewares/errorHandler.js";
import authRoutes from "../src/routes/authRoutes.js";
import profileRoutes from "../src/routes/profileRoutes.js"
import "dotenv/config";
import sessionConfig from "./config/sessions.js";
import { setupSwagger } from "../src/config/swagger.js";
import booksRoutes from "../src/routes/booksRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import aiRecommendationRoutes from "./routes/aiRecommendationRoutes.js";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1)

app.use(cors({
    origin: true, //process.env.CLIENT_ORIGIN,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);

setupSwagger(app);

// --- API ROUTES (keep these BEFORE static) ---
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/profiles", profileRoutes);
app.use("/api/v1/careers", careerRoutes);
app.use("/api/v1/ai/recommendations", aiRecommendationRoutes);

// --- SERVE FRONTEND BUILD ---
// 1. Put your frontend build folder as: backend/public  or backend/dist
const frontendPath = path.join(__dirname, "../public"); 
app.use(express.static(frontendPath));

// 2. SPA fallback - any route not /api/* goes to index.html
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(errorHandler);

export default app;