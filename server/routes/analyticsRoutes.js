// File: server/routes/analyticsRoutes.js
import express from 'express';
import {
    // Core analytics
    getSystemOverview,
    getVaccineCoverage,
    getDropoutRates,
    getZeroDoseChildren,
    getGrowthMonitoring,
    getTDCoverage,
    getDueOverdue,
    debugAnalyticsData,
    getMonthlyDropout,

    // Advanced analytics
    getTrends,
    getWardPerformance,
    getDisparities,
    getComparison,
    exportAnalytics,

    // Utility + system
    getFactsStatusController,
    refreshCache,

    // New endpoints
    getRollingDropout,

    getMonthlyInventory,
    saveMonthlyInventory, getInventoryHistory,
    autoFillInventory
} from '../controllers/analyticsController.js';

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* Legacy (backward-compatible) routes                                        */
/* -------------------------------------------------------------------------- */
router.get('/child/summary', getSystemOverview);
router.get('/child/trends', getVaccineCoverage);
router.get('/mother/summary', getTDCoverage);
router.get('/growth/summary', getGrowthMonitoring);

router.get('/inventory/auto-fill', autoFillInventory);

/* -------------------------------------------------------------------------- */
/* Main analytics routes (for dashboard)                                      */
/* -------------------------------------------------------------------------- */
router.get('/overview', getSystemOverview);            // System overview
router.get('/coverage', getVaccineCoverage);          // Vaccine coverage
router.get('/dropout', getDropoutRates);              // Dropout rates
router.get('/zero-dose', getZeroDoseChildren);        // Zero-dose count
router.get('/growth', getGrowthMonitoring);           // Growth & nutrition
router.get('/td-coverage', getTDCoverage);            // Mothers TD coverage
router.get('/due-overdue', getDueOverdue);            // Due vs overdue summary

/* -------------------------------------------------------------------------- */
/* Advanced analytics routes                                                  */
/* -------------------------------------------------------------------------- */
router.get('/trends', getTrends);                     // Time-series trends
router.get('/ward-performance', getWardPerformance);  // Ward rankings
router.get('/disparities', getDisparities);           // Gender/caste disparities
router.get('/comparison', getComparison);             // Period comparison
router.get('/export', exportAnalytics);               // Export CSVs

/* -------------------------------------------------------------------------- */
/* System + cache management                                                  */
/* -------------------------------------------------------------------------- */
router.get('/status', getFactsStatusController);       // Data health + last processed info
router.get('/refresh-cache', refreshCache);            // Clear cache (GET for easier triggering)
router.get('/debug', debugAnalyticsData);

// In your routes file, e.g., analyticsRoutes.js
router.get('/monthly-dropout', getMonthlyDropout);
router.get('/rolling-dropout', getRollingDropout);

// Add these to your analytics routes
router.get('/inventory', getMonthlyInventory);
router.post('/inventory', saveMonthlyInventory);
router.get('/inventory/history', getInventoryHistory);

/* -------------------------------------------------------------------------- */
export default router;