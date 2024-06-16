import { Router } from 'express';
import {  loginUser, registerUser } from '../controllers/user.controller.js';
 

const router = Router();

// Creating a user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

export default router;
