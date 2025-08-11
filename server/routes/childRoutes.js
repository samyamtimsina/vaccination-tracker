import express from 'express';
import {
  createChild,
  getAllChildren,
  getChild,
  getWardChildren,
} from '../controllers/childController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

//get all children
router.get(
  '/',
  authenticate,
  authorize('admin', 'ward_officer'),
  getAllChildren,
);

// Get all children belonging to the authenticated ward officer's ward
router.get(
  '/ward',
  authenticate,
  authorize('admin', 'ward_officer'),
  getWardChildren,
);

//get specific child by ID
router.get('/:id', authenticate, authorize('admin', 'ward_officer'), getChild);

// Route to create one or more new child records
router.post('/', authenticate, authorize('admin', 'ward_officer'), createChild);

export default router;
