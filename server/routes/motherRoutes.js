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
router.get('/search', searchMothers);
router.get('/:sewaDartaNumber', getMother);
router.put('/:sewaDartaNumber', updateMother);

export default router;
