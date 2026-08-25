import express from "express";
import errorHandler from "../src/middlewares/errorHandler.js";
import authRoutes from '../src/routes/authRoutes.js'
import session from "express-session"
import "dotenv/config"
import sessionConfig from "./config/sessions.js";

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(sessionConfig)

app.use(express.json());
app.use('/api/v1/auth', authRoutes)

app.use(errorHandler);

export default app;
