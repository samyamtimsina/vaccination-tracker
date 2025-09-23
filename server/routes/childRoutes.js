// In your routes file (e.g., routes/childRoutes.js)

import express from 'express';
import {
  createChild,
  getAllChildren,
  getChild,
  // getWardChildren,
  searchChildren,
  searchWardChildren,
  updateChild,
  // generateMockData, // Import the new function
} from '../controllers/childController.js';

// Import the authentication and authorization middleware
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get(
  '/all',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'WARD_OFFICER'),
  getAllChildren,
);
router.get('/search', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'WARD_OFFICER'), searchChildren);
router.get('/search-ward', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'WARD_OFFICER'), searchWardChildren);

// router.get(
//   '/ward',
//   authenticate,
//   authorize('ADMIN', 'SUPER_ADMIN', 'WARD_OFFICER'),
//   getWardChildren,
// );

router.get('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'WARD_OFFICER'), getChild);
router.put(
  '/:id',
  authenticate,
  authorize('SUPER_ADMIN', 'WARD_OFFICER'),
  updateChild,
);
//get all children

// Get all children belonging to the authenticated ward officer's ward

//get specific child by ID

// Route to create one or more new child records
router.post('/', authenticate, authorize('SUPER_ADMIN', 'WARD_OFFICER'), createChild);

// New dedicated route for generating mock data
// router.post(
//   '/generate-mock',
//   authenticate,
//   authorize('admin'),
//   generateMockData,
// );

export default router;
