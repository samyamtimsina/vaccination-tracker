import express from 'express';
import { createCitizen } from '../controllers/citizenController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorize('admin', 'ward_officer'),
  createCitizen,
);

export default router;
