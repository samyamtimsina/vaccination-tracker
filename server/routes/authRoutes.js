import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { getMe } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
