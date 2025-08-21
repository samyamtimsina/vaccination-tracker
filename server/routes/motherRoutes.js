import express from 'express';
import {
  createMother,
  getMothers,
  getWardMothers,
} from '../controllers/motherController.js';

import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post(
  '/',

  authenticate,
  authorize('ADMIN', 'WARD_OFFICER'),
  createMother,
);
router.get(
  '/',

  authenticate,
  authorize('ADMIN', 'WARD_OFFICER'),
  getMothers,
);
router.get(
  '/ward',
  authenticate,
  authorize('ADMIN', 'WARD_OFFICER'),
  getWardMothers,
);

export default router;
