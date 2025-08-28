// src/routes/userRoutes.js
import express from 'express';
import {
  getUserProfile,
  getMe,
  updateUserProfile,
  getUsers,
  disableUser,
  getWardUsers,
  approveUser,
  getAllUsers,
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/me', authenticate, getMe);
router.get('/all', authenticate, authorize('SUPER_ADMIN'), getAllUsers);
router.patch('/:userId', updateUserProfile);
router.get(
  '/:userId',
  authenticate,

  authorize('ADMIN', 'SUPER_ADMIN', ' WARD_OFFICER'),
  getUserProfile,
);

router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'WARD_OFFICER'), getWardUsers);

router.post('/disable-user/:id', authenticate,
  authorize('SUPER_ADMIN'),
  disableUser);
export default router;
