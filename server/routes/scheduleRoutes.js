import express from 'express';
import {
    getLatestVaccineSchedule,
    getAllVaccineSchedules,
    createNewScheduleVersion,
    createVaccineType,
    getVaccineTypes,
    updateVaccineType,
    deleteVaccineType,
    // createDose,
    // updateDose,
    // deleteDose,
    // createCatchUpRule,
    enableVaccineType,
    disableVaccineType,
} from '../controllers/scheduleController.js';

import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// --- Vaccine Schedule ---
// Route to get the latest vaccine schedule version
router.get(
    '/',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN', 'WARD_OFFICER'),
    getLatestVaccineSchedule
);
// Route to get all previous vaccine schedule versions
router.get(
    '/all',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN', 'WARD_OFFICER'),
    getAllVaccineSchedules
);
// Route to create a new vaccine schedule version
router.post(
    '/',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN'),
    createNewScheduleVersion
);

// --- Vaccine Types ---
// Route to get all vaccine types
router.get(
    '/types',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN', 'WARD_OFFICER'),
    getVaccineTypes
);
// Route to create a new vaccine type
router.post(
    '/types',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN'),
    createVaccineType
);
// Route to update a specific vaccine type by ID
router.patch(
    '/types/:id',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN'),
    updateVaccineType
);
// Route to permanently delete a vaccine type by ID
router.delete(
    '/types/:id',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN'),
    deleteVaccineType
);

// --- Fixes for Vaccine Type Enable/Disable ---
// These actions update the isActive status, so PATCH is more appropriate than DELETE.
// Also, the paths are made unique to avoid conflicts.
// Route to disable a specific vaccine type by ID
router.patch(
    '/types/disable/:id',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN'),
    disableVaccineType
);
// Route to enable a specific vaccine type by ID
router.patch(
    '/types/enable/:id',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN'),
    enableVaccineType

);

//disabled cause using createnewscheduleversion now

// // --- Doses ---
// // Route to create a new dose
// router.post(
//     '/dose',
//     authenticate,
//     authorize('SUPER_ADMIN', 'ADMIN'),
//     createDose
// );
// // Route to update a dose by ID
// router.patch(
//     '/dose/:id',
//     authenticate,
//     authorize('SUPER_ADMIN', 'ADMIN'),
//     updateDose
// );
// // Route to delete a dose by ID
// router.delete(
//     '/dose/:id',
//     authenticate,
//     authorize('SUPER_ADMIN', 'ADMIN'),
//     deleteDose
// );

// // --- Catch-Up Rules ---
// // Route to create a new catch-up rule
// router.post(
//     '/catchup',
//     authenticate,
//     authorize('SUPER_ADMIN', 'ADMIN'),
//     createCatchUpRule
// );

export default router;
