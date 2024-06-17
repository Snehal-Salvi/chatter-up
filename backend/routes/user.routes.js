import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";

const router = Router();

// POST route to register a new user
router.post("/register", registerUser);

// POST route to log in an existing user
router.post("/login", loginUser);

export default router;
