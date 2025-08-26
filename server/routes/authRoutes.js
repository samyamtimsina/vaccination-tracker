import express from 'express';
import { register, login, logout, refreshToken, verifyOtp } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/verify-otp', verifyOtp)

export default router;
