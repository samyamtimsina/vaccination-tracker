// src/routes/userRoutes.js
import express from 'express';
import {
  getUserProfile,
  getMe,
  updateUserProfile,
  getUsers,
  getWardUsers,
  getAllUsers,
  updateUserStatus,
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/me', authenticate, getMe);
router.get('/all', authenticate, authorize('SUPER_ADMIN'), getAllUsers);

router.get('/ward', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'WARD_OFFICER'), getWardUsers);

router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'WARD_OFFICER'), getUsers);

router.get(
  '/:userId',
  authenticate,

  authorize('ADMIN', 'SUPER_ADMIN', 'WARD_OFFICER'),
  getUserProfile,
);
router.patch('/:userId', updateUserProfile);


router.post('/update-user-status/:id', authenticate,
  authorize('SUPER_ADMIN'),
  updateUserStatus);
export default router;
