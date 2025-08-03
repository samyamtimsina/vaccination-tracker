import express from 'express';
import { createChild } from '../controllers/childController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize('admin', 'ward_officer'), createChild);

export default router;
