import express from 'express';
import { createMother, getMothers } from '../controllers/motherController.js';

import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post(
  '/',

  authenticate,
  authorize('admin', 'ward_officer'),
  createMother,
);
router.get(
  '/',

  authenticate,
  authorize('admin', 'ward_officer'),
  getMothers,
);

export default router;
