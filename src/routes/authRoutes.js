import express from "express";
import { registerUser } from "../controllers/register.js";
import { login } from "../controllers/login.js";
import { logout } from "../controllers/logout.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", login);

router.post("/logout", logout);

export default router;
