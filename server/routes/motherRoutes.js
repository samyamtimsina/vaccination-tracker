import express from 'express';
import { createMother, getMothers,getWardMothers } from '../controllers/motherController.js';

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
router.get('/ward',authenticate, authorize('admin', 'ward_officer'), getWardMothers);

export default router;
