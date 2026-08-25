import express from "express";
import errorHandler from "../src/middlewares/errorHandler.js";
import authRoutes from '../src/routes/authRoutes.js'
import session from "express-session"
import "dotenv/config"

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        maxAge: 1000 * 60 * 60 
    }
}))

app.use(express.json());
app.use('/api/v1/auth', authRoutes)

app.use(errorHandler);

export default app;
