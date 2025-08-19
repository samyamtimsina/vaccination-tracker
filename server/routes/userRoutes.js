// src/routes/userRoutes.js
import express from 'express';
import {
  getUserProfile,
  getMe,
  updateUserProfile,
  getUsers,
  getWardUsers,
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/me', authenticate, getMe);
router.get(
  '/:userId',
  authenticate,

  authorize('admin', 'ward_officer'),
  getUserProfile,
);

router.get('/', authenticate, authorize('admin', 'ward_officer'), getWardUsers);
export default router;

