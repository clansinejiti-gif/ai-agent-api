import express from "express";
import { registerUser } from "../controllers/register.js";
import { login } from "../controllers/login.js";

const router = express.Router();

router.post("/register", registerUser);

router.post('/login', login)

export default router;
