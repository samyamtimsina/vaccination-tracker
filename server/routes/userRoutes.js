// src/routes/userRoutes.js
import express from 'express';
import {
  getUserProfile,
  getMe,
  updateUserProfile,
  getUsers,
  getWardUsers,
  approveUser,
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/me', authenticate, getMe);
router.get(
  '/:userId',
  authenticate,

  authorize('ADMIN', ' WARD_OFFICER'),
  getUserProfile,
);

router.get('/', authenticate, authorize('ADMIN', 'WARD_OFFICER'), getWardUsers);

router.patch(
  '/approve/:id',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  approveUser,
);
export default router;
