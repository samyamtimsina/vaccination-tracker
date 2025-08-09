import express from 'express';
import {
  createChild,
  getAllChildren,
  getChild,
} from '../controllers/childController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get(
  '/',
  authenticate,
  authorize('admin', 'ward_officer'),
  getAllChildren,
);

router.get('/:id', authenticate, authorize('admin', 'ward_officer'), getChild);

// Route to create one or more new child records
router.post('/', authenticate, authorize('admin', 'ward_officer'), createChild);

export default router;
