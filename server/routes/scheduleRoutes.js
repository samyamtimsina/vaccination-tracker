import express from 'express';
import { getLatestVaccineSchedule } from '../controllers/scheduleController.js';

const router = express.Router();

router.get('/', getLatestVaccineSchedule);

export default router;