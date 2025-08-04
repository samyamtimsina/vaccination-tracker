import express from 'express';
import {
  createChild,
  getAllChildren,
  getChild,
} from '../controllers/childController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Route to get a list of all children
// Protected route: requires authentication and authorization for admin or ward_officer roles
router.get(
  '/',
  authenticate,
  authorize('admin', 'ward_officer'),
  getAllChildren,
);

// Route to get a single child by ID
// Protected route: requires authentication and authorization
router.get('/:id', authenticate, authorize('admin', 'ward_officer'), getChild);

// Route to create one or more new child records
router.post('/', authenticate, authorize('admin', 'ward_officer'), createChild);

export default router;
