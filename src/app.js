import express from "express";
// import errorHandler from "../src/middlewares/errorHandler.js";
// import authRoutes from "../src/routes/authRoutes.js";
import "dotenv/config";
import sessionConfig from "./config/sessions.js";
import { setupSwagger } from "../src/config/swagger.js";
import booksRoutes from "../src/routes/booksRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);

// app.use("/api/v1/auth", authRoutes);

setupSwagger(app);
app.use("api/v1", booksRoutes);

// app.use(errorHandler);

export default app;
