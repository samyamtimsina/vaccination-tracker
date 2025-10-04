import express from 'express';
import {
    analyticsLimiter,
    getCoverage,
    getDropoff,
    getTimeliness,
    getMissed,
    getTrends,
    getWorkerPerformance,
    getMotherCoverage,
    getAgeBasedAnalysis,
    getScheduleAdherence,
    getWardComparison,
    getDefaulters,
    getCatchUpAnalysis,
    getTDAnalysis,
    getNotificationAnalysis,
    getWeightAnalysis,
    getWeightInsights,
    getRegistrationTrends,
    getUserProductivity,
    getDataQuality,
    getDoseCompletionAnalysis,
    getDueVaccineAnalysis,
    getAuditAnalysis,
    getSecurityAnalysis,
    getCertificateAnalysis,
    getCorrectionAnalysis
} from '../controllers/analyticsController.js';

import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Apply rate limiting
router.use(analyticsLimiter);

// Roles allowed to access analytics
const ALLOWED_ROLES = ['ADMIN', 'SUPER_ADMIN', 'WARD_OFFICER'];

/**
 * ===============================
 *   CHILD & VACCINE ANALYTICS
 * ===============================
 */
router.get('/coverage', authenticate, authorize(...ALLOWED_ROLES), getCoverage);
router.get('/dropoff', authenticate, authorize(...ALLOWED_ROLES), getDropoff);
router.get('/timeliness', authenticate, authorize(...ALLOWED_ROLES), getTimeliness);
router.get('/missed', authenticate, authorize(...ALLOWED_ROLES), getMissed);
router.get('/trends', authenticate, authorize(...ALLOWED_ROLES), getTrends);
router.get('/age-analysis', authenticate, authorize(...ALLOWED_ROLES), getAgeBasedAnalysis);
router.get('/schedule-adherence', authenticate, authorize(...ALLOWED_ROLES), getScheduleAdherence);
router.get('/ward-comparison', authenticate, authorize(...ALLOWED_ROLES), getWardComparison);
router.get('/defaulters', authenticate, authorize(...ALLOWED_ROLES), getDefaulters);
router.get('/catchup-analysis', authenticate, authorize(...ALLOWED_ROLES), getCatchUpAnalysis); // renamed to match controller
router.get('/certificate-analysis', authenticate, authorize(...ALLOWED_ROLES), getCertificateAnalysis);
router.get('/correction-analysis', authenticate, authorize(...ALLOWED_ROLES), getCorrectionAnalysis);

/**
 * ===============================
 *   MOTHER & TD ANALYTICS
 * ===============================
 */
router.get('/mother-coverage', authenticate, authorize(...ALLOWED_ROLES), getMotherCoverage);
router.get('/td-analysis', authenticate, authorize(...ALLOWED_ROLES), getTDAnalysis);

/**
 * ===============================
 *   NOTIFICATION & PERFORMANCE
 * ===============================
 */
router.get('/notification-analysis', authenticate, authorize(...ALLOWED_ROLES), getNotificationAnalysis);
router.get('/worker-performance', authenticate, authorize(...ALLOWED_ROLES), getWorkerPerformance);

/**
 * ===============================
 *   WEIGHT & GROWTH ANALYTICS
 * ===============================
 */
router.get('/weight-analysis', authenticate, authorize(...ALLOWED_ROLES), getWeightAnalysis);
router.get('/weight-insights', authenticate, authorize(...ALLOWED_ROLES), getWeightInsights);

/**
 * ===============================
 *   REGISTRATION & USER ANALYTICS
 * ===============================
 */
router.get('/registration-trends', authenticate, authorize(...ALLOWED_ROLES), getRegistrationTrends);
router.get('/user-productivity', authenticate, authorize(...ALLOWED_ROLES), getUserProductivity);
router.get('/data-quality', authenticate, authorize(...ALLOWED_ROLES), getDataQuality);

/**
 * ===============================
 *   PROGRAM COMPLETION ANALYTICS
 * ===============================
 */
router.get('/dose-completion', authenticate, authorize(...ALLOWED_ROLES), getDoseCompletionAnalysis);
router.get('/due-vaccine-analysis', authenticate, authorize(...ALLOWED_ROLES), getDueVaccineAnalysis);

/**
 * ===============================
 *   SYSTEM & SECURITY ANALYTICS
 * ===============================
 */
router.get('/audit-analysis', authenticate, authorize(...ALLOWED_ROLES), getAuditAnalysis);
router.get('/security-analysis', authenticate, authorize(...ALLOWED_ROLES), getSecurityAnalysis);

export default router;
