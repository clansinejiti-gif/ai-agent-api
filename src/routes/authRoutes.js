import express from "express";
import { registerUser } from "../controllers/register.js";
import { login } from "../controllers/login.js";
import { logout } from "../controllers/logout.js";
import { authMe } from "../controllers/profile.js";
import requireAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", login);

router.post("/logout", logout);

router.get('/me', requireAuth, authMe)

export default router;
