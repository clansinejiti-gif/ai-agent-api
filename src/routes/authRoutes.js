import express from "express";
import { registerUser } from "../controllers/register.js";

const router = express.Router();

router.post("/api/v1/auth/register", registerUser);

export default router;
