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

const app = express();
app.set('trust proxy', 1)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);

setupSwagger(app);
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/books", booksRoutes);

app.use("/api/v1/profiles", profileRoutes);

app.use("/api/v1/careers", careerRoutes);
app.use("/api/v1/ai/recommendations", aiRecommendationRoutes);

app.use(errorHandler);

export default app;
