import express from 'express';
import {
  createMother,
  getMothers,
  getWardMothers,
  searchMothers,
  getMother,
  updateMother,
} from '../controllers/motherController.js';

import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorize('SUPER_ADMIN', 'WARD_OFFICER'),
  createMother
);

router.get(
  '/all',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN', 'WARD_OFFICER'),
  getMothers
);

router.get(
  '/ward',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN', 'WARD_OFFICER'),
  getWardMothers
);

router.get(
  '/search',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN', 'WARD_OFFICER'),
  searchMothers
);

router.get(
  '/:sewaDartaNumber',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN', 'WARD_OFFICER'),
  getMother
);

router.put(
  '/:sewaDartaNumber',
  authenticate,
  authorize('SUPER_ADMIN', 'WARD_OFFICER'),
  updateMother
);

export default router;
