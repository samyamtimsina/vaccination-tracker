import express from 'express';
import {
    analyticsLimiter,

    // Core vaccination analytics
    getVaccineCoverage,
    getZeroDoseChildren,
    getDropoutRates,
    getVaccinationTimeliness,

    // Growth & nutrition analytics
    getWeightCoverage,
    getGrowthTrajectories,
    getGrowthFaltering,

    // Maternal & TD analytics
    getTDCompletion,
    getMotherChildLinkage,

    // Default tracking & follow-up
    getDefaulterTracking,

    // Cohort & trend analysis
    getCohortAnalysis,
    getYearlyTrends,

    // Data quality & monitoring
    getDataCompleteness,
    // getRecordTimeliness, // Removed as it is not exported from analyticsController.js

    // Predictive analytics & alerts
    getDefaultRiskPrediction,
    getSystemOverview

} from '../controllers/analyticsController.js';

import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Apply rate limiting
router.use(analyticsLimiter);

// Roles allowed to access analytics
const ALLOWED_ROLES = ['ADMIN', 'SUPER_ADMIN', 'WARD_OFFICER'];

/**
 * ===============================
 * DASHBOARD & OVERVIEW ROUTES
 * ===============================
 */
router.get('/system-overview', authenticate, authorize(...ALLOWED_ROLES), getSystemOverview);

/**
 * ===============================
 * VACCINATION ANALYTICS
 * ===============================
 */
router.get('/vaccine-coverage', authenticate, authorize(...ALLOWED_ROLES), getVaccineCoverage);
router.get('/zero-dose-children', authenticate, authorize(...ALLOWED_ROLES), getZeroDoseChildren);
router.get('/dropout-rates', authenticate, authorize(...ALLOWED_ROLES), getDropoutRates);
router.get('/vaccination-timeliness', authenticate, authorize(...ALLOWED_ROLES), getVaccinationTimeliness);

/**
 * ===============================
 * GROWTH & NUTRITION ANALYTICS
 * ===============================
 */
router.get('/weight-coverage', authenticate, authorize(...ALLOWED_ROLES), getWeightCoverage);
router.get('/growth-trajectories', authenticate, authorize(...ALLOWED_ROLES), getGrowthTrajectories);
router.get('/growth-faltering', authenticate, authorize(...ALLOWED_ROLES), getGrowthFaltering);

/**
 * ===============================
 * MATERNAL & TD ANALYTICS
 * ===============================
 */
router.get('/td-completion', authenticate, authorize(...ALLOWED_ROLES), getTDCompletion);
router.get('/mother-child-linkage', authenticate, authorize(...ALLOWED_ROLES), getMotherChildLinkage);

/**
 * ===============================
 * DEFAULT TRACKING & FOLLOW-UP
 * ===============================
 */
router.get('/defaulter-tracking', authenticate, authorize(...ALLOWED_ROLES), getDefaulterTracking);

/**
 * ===============================
 * COHORT & TREND ANALYSIS
 * ===============================
 */
router.get('/cohort-analysis', authenticate, authorize(...ALLOWED_ROLES), getCohortAnalysis);
router.get('/yearly-trends', authenticate, authorize(...ALLOWED_ROLES), getYearlyTrends);

/**
 * ===============================
 * DATA QUALITY & MONITORING
 * ===============================
 */
router.get('/data-completeness', authenticate, authorize(...ALLOWED_ROLES), getDataCompleteness);
// Removed: router.get('/record-timeliness', authenticate, authorize(...ALLOWED_ROLES), getRecordTimeliness);

/**
 * ===============================
 * PREDICTIVE ANALYTICS & ALERTS
 * ===============================
 */
router.get('/default-risk-prediction', authenticate, authorize(...ALLOWED_ROLES), getDefaultRiskPrediction);

export default router;