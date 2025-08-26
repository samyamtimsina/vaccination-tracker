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
router.post('/disable-user/:id', authenticate, disableUser);
export default router;
