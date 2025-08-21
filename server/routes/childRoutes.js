// In your routes file (e.g., routes/childRoutes.js)

import express from 'express';
import {
  createChild,
  getAllChildren,
  getChild,
  getWardChildren,
  updateChild,
  // generateMockData, // Import the new function
} from '../controllers/childController.js';

// Import the authentication and authorization middleware
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get(
  '/ward',
  authenticate,
  authorize('ADMIN', 'ward_officer'),
  getWardChildren,
);

router.get('/:id', authenticate, authorize('ADMIN', 'WARD_OFFICER'), getChild);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'WARD_OFFICER'),
  updateChild,
);
//get all children
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'ward_officer'),
  getAllChildren,
);

// Get all children belonging to the authenticated ward officer's ward

//get specific child by ID

// Route to create one or more new child records
router.post('/', authenticate, authorize('ADMIN', 'WARD_OFFICER'), createChild);

// New dedicated route for generating mock data
// router.post(
//   '/generate-mock',
//   authenticate,
//   authorize('admin'),
//   generateMockData,
// );

export default router;
