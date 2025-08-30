import express from 'express';
import {
    getLatestVaccineSchedule,
    getAllVaccineSchedules,
    createVaccineSchedule,
    updateVaccineSchedule,
} from '../controllers/scheduleController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get(
    '/',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN', 'WARD_OFFICER'),
    getLatestVaccineSchedule
);
router.get(
    '/all',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN', 'WARD_OFFICER'),
    getAllVaccineSchedules
);
router.post(
    '/',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN'),
    createVaccineSchedule
);
router.put(
    '/:id',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN'),
    updateVaccineSchedule
);

export default router;
