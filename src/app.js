import express from "express";
import errorHandler from "../src/middlewares/errorHandler.js";
import authRoutes from '../src/routes/authRoutes.js'

const app = express();

app.use(express.json());
app.use('/api/v1/auth/register', authRoutes)


app.use(errorHandler);

export default app;
