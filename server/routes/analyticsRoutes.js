// File: server/routes/analyticsRoutes.js
import express from 'express';
import {
    getSystemOverview,
    getVaccineCoverage,
    getDropoutRates,
    getZeroDoseChildren,
    getGrowthMonitoring,
    getTDCoverage,
    refreshCache,
    getFactsStatusController,
    getDueOverdue
} from '../controllers/analyticsController.js';

const router = express.Router();

// --- Legacy / backward-compatible routes ---
router.get('/child/summary', getSystemOverview);
router.get('/child/trends', getVaccineCoverage);
router.get('/mother/summary', getTDCoverage);
router.get('/growth/summary', getGrowthMonitoring);

// --- Dashboard / full analytics routes ---
router.get('/overview', getSystemOverview);         // System overview (children, mothers, nutrition)
router.get('/coverage', getVaccineCoverage);       // Vaccine coverage by filters
router.get('/dropout', getDropoutRates);           // Dropout rates
router.get('/zero-dose', getZeroDoseChildren);     // Zero-dose children
router.get('/growth', getGrowthMonitoring);        // Growth/nutrition monitoring
router.get('/td-coverage', getTDCoverage);         // Mothers TD coverage
router.get('/status', getFactsStatusController);   // Analytics facts status
router.post('/refresh-cache', refreshCache);       // Clear cache
router.get('/due-overdue', getDueOverdue);  // Add this line


export default router;
