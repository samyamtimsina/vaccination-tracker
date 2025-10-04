import { prisma } from '../utils/prisma.js';
import rateLimit from 'express-rate-limit';

// --- Rate limiter ---
export const analyticsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// --- Validation utilities ---
const MAX_STRING_LENGTH = { VACCINE: 100, NAME: 255 };
const SAFE_INTERVALS = ['month', 'quarter', 'year'];

const ValidationUtils = {
    validateInteger: (value, fieldName, min = 0, max = Number.MAX_SAFE_INTEGER) => {
        if (value === null || value === undefined) return null;
        const num = parseInt(value);
        if (isNaN(num) || num < min || num > max)
            throw new Error(`Invalid ${fieldName}: must be between ${min} and ${max}`);
        return num;
    },
    validateString: (value, fieldName, maxLength = MAX_STRING_LENGTH.VACCINE) => {
        if (value === null || value === undefined) return null;
        if (typeof value !== 'string') throw new Error(`Invalid ${fieldName}: must be a string`);
        const sanitized = value.trim();
        if (!sanitized) throw new Error(`Invalid ${fieldName}: cannot be empty`);
        if (sanitized.length > maxLength) throw new Error(`Invalid ${fieldName}: too long`);
        return sanitized;
    },
    validateDate: (value, fieldName) => {
        if (!value) return null;
        const date = new Date(value);
        if (isNaN(date.getTime())) throw new Error(`Invalid ${fieldName}: must be a valid date`);
        const currentYear = new Date().getFullYear();
        if (date.getFullYear() < 1900 || date.getFullYear() > currentYear + 5)
            throw new Error(`Invalid ${fieldName}: date out of range`);
        return date;
    },
};

// --- Error handler ---
const handleError = (res, error, context) => {
    console.error(`${context} error:`, error);
    const isValidationError = error.message.includes('Invalid');
    res.status(isValidationError ? 400 : 500).json({
        success: false,
        error: isValidationError ? error.message : 'Internal server error',
    });
};

// --- Coverage endpoint ---
export const getCoverage = async (req, res) => {
    try {
        const { ward, vaccine, startDate, endDate } = req.query;

        const wardNumber = ValidationUtils.validateInteger(ward, 'ward number', 0);
        const sanitizedVaccine = ValidationUtils.validateString(vaccine, 'vaccine');
        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');

        if (startDateObj && endDateObj && startDateObj > endDateObj)
            return res.status(400).json({ success: false, error: 'Start date cannot be after end date' });

        let vaccineTypeId;
        if (sanitizedVaccine) {
            const vaccineType = await prisma.vaccineType.findFirst({ where: { name: sanitizedVaccine } });
            if (!vaccineType) return res.status(404).json({ success: false, error: 'Vaccine not found' });
            vaccineTypeId = vaccineType.id;
        }

        const whereClause = {
            ...(wardNumber ? { wardOfVaccination: wardNumber } : {}),
            ...(vaccineTypeId ? { vaccineTypeId } : {}),
            ...(startDateObj ? { dateGiven: { gte: startDateObj } } : {}),
            ...(endDateObj ? { dateGiven: { lte: endDateObj } } : {}),
        };

        const totalChildren = await prisma.child.count({ where: wardNumber ? { wardNumber } : {} });

        const coverageStats = await prisma.vaccinationRecord.groupBy({
            by: ['vaccineTypeId', 'wardOfVaccination'],
            _count: { citizenId: true, id: true },
            _avg: { doseNumber: true },
            where: whereClause,
            orderBy: { wardOfVaccination: 'asc' },
        });

        const vaccineIds = coverageStats.map(s => s.vaccineTypeId);
        const vaccines = await prisma.vaccineType.findMany({
            where: { id: { in: vaccineIds } },
            select: { id: true, name: true },
        });
        const vaccineMap = Object.fromEntries(vaccines.map(v => [v.id, v.name]));

        const formatted = coverageStats.map(s => ({
            vaccineName: vaccineMap[s.vaccineTypeId],
            ward: s.wardOfVaccination,
            vaccinatedChildren: s._count.citizenId,
            totalDoses: s._count.id,
            averageDoseNumber: s._avg.doseNumber || 0,
            coveragePercentage: totalChildren ? ((s._count.citizenId / totalChildren) * 100).toFixed(2) : '0',
        }));

        res.json({ success: true, data: { totalEligibleChildren: totalChildren, coverageStats: formatted } });
    } catch (error) {
        handleError(res, error, 'Coverage analysis');
    }
};

// --- Dropoff endpoint ---
export const getDropoff = async (req, res) => {
    try {
        const { ward, vaccine, startDate, endDate } = req.query;

        const wardNumber = ValidationUtils.validateInteger(ward, 'ward number', 0);
        const sanitizedVaccine = ValidationUtils.validateString(vaccine, 'vaccine');
        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');

        if (startDateObj && endDateObj && startDateObj > endDateObj)
            return res.status(400).json({ success: false, error: 'Start date cannot be after end date' });

        let vaccineTypeId;
        if (sanitizedVaccine) {
            const vaccineType = await prisma.vaccineType.findFirst({ where: { name: sanitizedVaccine } });
            if (!vaccineType) return res.status(404).json({ success: false, error: 'Vaccine not found' });
            vaccineTypeId = vaccineType.id;
        }

        const whereClause = {
            ...(vaccineTypeId ? { vaccineTypeId } : {}),
            ...(startDateObj ? { dateGiven: { gte: startDateObj } } : {}),
            ...(endDateObj ? { dateGiven: { lte: endDateObj } } : {}),
        };

        if (wardNumber) {
            const childIds = await prisma.child.findMany({
                where: { wardNumber },
                select: { id: true },
            });
            whereClause.citizenId = { in: childIds.map(c => c.id) };
        }

        const dropoff = await prisma.vaccinationRecord.groupBy({
            by: ['vaccineTypeId', 'doseNumber'],
            _count: { citizenId: true },
            where: whereClause,
            orderBy: { doseNumber: 'asc' },
        });

        res.json({ success: true, data: { funnelData: dropoff } });
    } catch (error) {
        handleError(res, error, 'Dropoff analysis');
    }
};

// --- Timeliness endpoint (UPDATED for schema compatibility) ---
export const getTimeliness = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');

        const whereClause = {
            ...(startDateObj ? { dateGiven: { gte: startDateObj } } : {}),
            ...(endDateObj ? { dateGiven: { lte: endDateObj } } : {}),
        };

        // Since dueDate field doesn't exist in VaccinationRecord, use ChildDueVaccine for timeliness
        const dueVaccines = await prisma.childDueVaccine.findMany({
            where: {
                ...(startDateObj ? { dueDate: { gte: startDateObj } } : {}),
                ...(endDateObj ? { dueDate: { lte: endDateObj } } : {}),
            },
            include: {
                child: {
                    include: {
                        vaccinations: {
                            where: whereClause,
                            select: { dateGiven: true, vaccineTypeId: true, doseNumber: true }
                        }
                    }
                }
            }
        });

        let onTime = 0;
        let late = 0;
        let total = 0;

        dueVaccines.forEach(dueVaccine => {
            const correspondingVaccination = dueVaccine.child.vaccinations.find(
                v => v.vaccineTypeId === dueVaccine.vaccineTypeId && v.doseNumber === dueVaccine.doseNumber
            );

            if (correspondingVaccination) {
                total++;
                if (correspondingVaccination.dateGiven <= dueVaccine.dueDate) {
                    onTime++;
                } else {
                    late++;
                }
            }
        });

        res.json({ success: true, data: { total, onTime, late } });
    } catch (error) {
        handleError(res, error, 'Timeliness analysis');
    }
};

// --- Trends endpoint ---
export const getTrends = async (req, res) => {
    try {
        const { interval = 'month', startDate, endDate } = req.query;

        if (!SAFE_INTERVALS.includes(interval)) {
            return res.status(400).json({ success: false, error: 'Invalid interval. Use month/quarter/year' });
        }

        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');

        const whereClause = {
            ...(startDateObj ? { dateGiven: { gte: startDateObj } } : {}),
            ...(endDateObj ? { dateGiven: { lte: endDateObj } } : {}),
        };

        const records = await prisma.vaccinationRecord.findMany({
            where: whereClause,
            select: { dateGiven: true },
        });

        // Group in Node.js
        const buckets = {};
        for (const r of records) {
            const d = new Date(r.dateGiven);
            let key = '';
            if (interval === 'month') key = `${d.getFullYear()}-${d.getMonth() + 1}`;
            else if (interval === 'quarter') key = `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}`;
            else key = `${d.getFullYear()}`;

            buckets[key] = (buckets[key] || 0) + 1;
        }

        const result = Object.entries(buckets).map(([period, count]) => ({ period, vaccinations: count }));
        res.json({ success: true, data: result });
    } catch (error) {
        handleError(res, error, 'Trends analysis');
    }
};

// --- Missed vaccinations endpoint (UPDATED for schema compatibility) ---
export const getMissed = async (req, res) => {
    try {
        const today = new Date();

        const due = await prisma.childDueVaccine.findMany({
            where: {
                dueDate: { lte: today },
                isCompleted: false
            },
            include: {
                child: {
                    select: { id: true, fullName: true, wardNumber: true }
                },
                vaccineType: {
                    select: { name: true }
                }
            }
        });

        const missedWithDetails = due.map(d => ({
            id: d.id,
            vaccineTypeId: d.vaccineTypeId,
            dueDate: d.dueDate,
            child: d.child,
            vaccineName: d.vaccineType.name,
            doseNumber: d.doseNumber
        }));

        res.json({ success: true, data: { missedCount: due.length, missed: missedWithDetails } });
    } catch (error) {
        handleError(res, error, 'Missed vaccinations');
    }
};

// --- Worker performance endpoint ---
export const getWorkerPerformance = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');

        const whereClause = {
            ...(startDateObj ? { dateGiven: { gte: startDateObj } } : {}),
            ...(endDateObj ? { dateGiven: { lte: endDateObj } } : {}),
        };

        const records = await prisma.vaccinationRecord.groupBy({
            by: ['administeredById'],
            _count: { id: true },
            where: whereClause,
        });

        const workerIds = records.map(r => r.administeredById).filter(Boolean);
        const workers = await prisma.user.findMany({
            where: { id: { in: workerIds } },
            select: { id: true, name: true },
        });
        const workerMap = Object.fromEntries(workers.map(w => [w.id, w.name]));

        const formatted = records.map(r => ({
            worker: workerMap[r.administeredById] || 'Unknown',
            totalAdministered: r._count.id,
        }));

        res.json({ success: true, data: formatted });
    } catch (error) {
        handleError(res, error, 'Worker performance');
    }
};

// --- Mother coverage endpoint (UPDATED for schema compatibility) ---
export const getMotherCoverage = async (req, res) => {
    try {
        const mothers = await prisma.mother.findMany({
            select: { id: true, name: true },
        });

        // Since mothers don't have direct vaccination records in your schema,
        // we'll check TD doses as an indicator of mother vaccination coverage
        const mothersWithTD = await prisma.mother.findMany({
            where: {
                tdDoses: {
                    some: {} // At least one TD dose
                }
            },
            select: { id: true }
        });

        res.json({
            success: true,
            data: {
                totalMothers: mothers.length,
                vaccinatedMothers: mothersWithTD.length,
                coveragePercentage: mothers.length
                    ? ((mothersWithTD.length / mothers.length) * 100).toFixed(2)
                    : '0',
            },
        });
    } catch (error) {
        handleError(res, error, 'Mother coverage');
    }
};

// --- Age-based vaccination analysis ---
export const getAgeBasedAnalysis = async (req, res) => {
    try {
        const { ward, vaccine, startDate, endDate } = req.query;

        const wardNumber = ValidationUtils.validateInteger(ward, 'ward number', 0);
        const sanitizedVaccine = ValidationUtils.validateString(vaccine, 'vaccine');
        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');

        let vaccineTypeId;
        if (sanitizedVaccine) {
            const vaccineType = await prisma.vaccineType.findFirst({ where: { name: sanitizedVaccine } });
            if (!vaccineType) return res.status(404).json({ success: false, error: 'Vaccine not found' });
            vaccineTypeId = vaccineType.id;
        }

        const childWhere = {
            ...(wardNumber ? { wardNumber } : {}),
        };

        const vaccinationWhere = {
            ...(vaccineTypeId ? { vaccineTypeId } : {}),
            ...(startDateObj ? { dateGiven: { gte: startDateObj } } : {}),
            ...(endDateObj ? { dateGiven: { lte: endDateObj } } : {}),
        };

        const children = await prisma.child.findMany({
            where: childWhere,
            include: {
                vaccinations: {
                    where: vaccinationWhere,
                    include: { vaccineType: true }
                }
            }
        });

        const ageGroups = {
            '0-6 months': { vaccinated: 0, total: 0 },
            '6-12 months': { vaccinated: 0, total: 0 },
            '1-2 years': { vaccinated: 0, total: 0 },
            '2-5 years': { vaccinated: 0, total: 0 },
            '5+ years': { vaccinated: 0, total: 0 }
        };

        const today = new Date();

        children.forEach(child => {
            const ageInMonths = (today - new Date(child.birthDate)) / (1000 * 60 * 60 * 24 * 30.44);
            let ageGroup;

            if (ageInMonths <= 6) ageGroup = '0-6 months';
            else if (ageInMonths <= 12) ageGroup = '6-12 months';
            else if (ageInMonths <= 24) ageGroup = '1-2 years';
            else if (ageInMonths <= 60) ageGroup = '2-5 years';
            else ageGroup = '5+ years';

            ageGroups[ageGroup].total++;
            if (child.vaccinations.length > 0) {
                ageGroups[ageGroup].vaccinated++;
            }
        });

        const result = Object.entries(ageGroups).map(([ageGroup, data]) => ({
            ageGroup,
            vaccinated: data.vaccinated,
            total: data.total,
            coveragePercentage: data.total > 0 ? ((data.vaccinated / data.total) * 100).toFixed(2) : '0'
        }));

        res.json({ success: true, data: result });
    } catch (error) {
        handleError(res, error, 'Age-based analysis');
    }
};

// --- Vaccine schedule adherence (UPDATED for schema compatibility) ---
export const getScheduleAdherence = async (req, res) => {
    try {
        const { ward, vaccine } = req.query;

        const wardNumber = ValidationUtils.validateInteger(ward, 'ward number', 0);
        const sanitizedVaccine = ValidationUtils.validateString(vaccine, 'vaccine');

        let vaccineTypeId;
        if (sanitizedVaccine) {
            const vaccineType = await prisma.vaccineType.findFirst({ where: { name: sanitizedVaccine } });
            if (!vaccineType) return res.status(404).json({ success: false, error: 'Vaccine not found' });
            vaccineTypeId = vaccineType.id;
        }

        const dueVaccines = await prisma.childDueVaccine.findMany({
            where: {
                ...(vaccineTypeId ? { vaccineTypeId } : {}),
                child: wardNumber ? { wardNumber } : undefined
            },
            include: {
                child: { select: { wardNumber: true } },
                vaccineType: { select: { name: true } }
            }
        });

        const today = new Date();
        const adherenceStats = {
            onTime: dueVaccines.filter(v => v.isCompleted && new Date(v.dueDate) >= today).length,
            late: dueVaccines.filter(v => v.isCompleted && new Date(v.dueDate) < today).length,
            missed: dueVaccines.filter(v => !v.isCompleted && new Date(v.dueDate) < today).length,
            upcoming: dueVaccines.filter(v => !v.isCompleted && new Date(v.dueDate) >= today).length
        };

        const total = Object.values(adherenceStats).reduce((sum, count) => sum + count, 0);

        res.json({
            success: true,
            data: {
                ...adherenceStats,
                total,
                adherencePercentage: total > 0 ? (((adherenceStats.onTime + adherenceStats.late) / total) * 100).toFixed(2) : '0',
                timelinessPercentage: (adherenceStats.onTime + adherenceStats.late) > 0 ?
                    ((adherenceStats.onTime / (adherenceStats.onTime + adherenceStats.late)) * 100).toFixed(2) : '0'
            }
        });
    } catch (error) {
        handleError(res, error, 'Schedule adherence analysis');
    }
};

// --- Ward comparison dashboard ---
export const getWardComparison = async (req, res) => {
    try {
        const { startDate, endDate, metric = 'coverage' } = req.query;

        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');

        const validMetrics = ['coverage', 'timeliness', 'completion'];
        if (!validMetrics.includes(metric)) {
            return res.status(400).json({ success: false, error: 'Invalid metric. Use: coverage, timeliness, completion' });
        }

        const whereClause = {
            ...(startDateObj ? { dateGiven: { gte: startDateObj } } : {}),
            ...(endDateObj ? { dateGiven: { lte: endDateObj } } : {}),
        };

        // Get ward-wise statistics
        const wardStats = await prisma.vaccinationRecord.groupBy({
            by: ['wardOfVaccination'],
            _count: { id: true, citizenId: true },
            where: whereClause,
            orderBy: { wardOfVaccination: 'asc' }
        });

        // Get total children per ward
        const wardChildren = await prisma.child.groupBy({
            by: ['wardNumber'],
            _count: { id: true }
        });

        const childrenByWard = Object.fromEntries(
            wardChildren.map(w => [w.wardNumber, w._count.id])
        );

        const comparison = wardStats.map(stat => {
            const totalChildren = childrenByWard[stat.wardOfVaccination] || 0;
            return {
                ward: stat.wardOfVaccination,
                totalVaccinations: stat._count.id,
                uniqueChildren: stat._count.citizenId,
                totalChildren,
                coveragePercentage: totalChildren > 0 ? ((stat._count.citizenId / totalChildren) * 100).toFixed(2) : '0'
            };
        });

        // Sort by the requested metric
        comparison.sort((a, b) => {
            if (metric === 'coverage') return parseFloat(b.coveragePercentage) - parseFloat(a.coveragePercentage);
            if (metric === 'completion') return b.totalVaccinations - a.totalVaccinations;
            return 0; // Default sort
        });

        res.json({ success: true, data: { wardComparison: comparison, sortedBy: metric } });
    } catch (error) {
        handleError(res, error, 'Ward comparison');
    }
};


// --- Defaulter tracking ---
export const getDefaulters = async (req, res) => {
    try {
        const { ward, daysOverdue = 30, vaccine } = req.query;

        const wardNumber = ValidationUtils.validateInteger(ward, 'ward number', 0);
        const overdueDays = ValidationUtils.validateInteger(daysOverdue, 'days overdue', 1, 365);
        const sanitizedVaccine = ValidationUtils.validateString(vaccine, 'vaccine');

        let vaccineTypeId;
        if (sanitizedVaccine) {
            const vaccineType = await prisma.vaccineType.findFirst({ where: { name: sanitizedVaccine } });
            if (!vaccineType) return res.status(404).json({ success: false, error: 'Vaccine not found' });
            vaccineTypeId = vaccineType.id;
        }

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - overdueDays);

        const defaulters = await prisma.childDueVaccine.findMany({
            where: {
                isCompleted: false,
                dueDate: { lte: cutoffDate },
                ...(vaccineTypeId ? { vaccineTypeId } : {}),
                child: wardNumber ? { wardNumber } : undefined
            },
            include: {
                child: {
                    select: {
                        id: true,
                        fullName: true,
                        wardNumber: true,
                        phoneNumber: true,
                        parentName: true,
                        birthDate: true
                    }
                },
                vaccineType: { select: { name: true } }
            },
            orderBy: { dueDate: 'asc' }
        });

        const defaulterSummary = defaulters.map(d => {
            const today = new Date();
            const daysOverdue = Math.floor((today - new Date(d.dueDate)) / (1000 * 60 * 60 * 24));
            const childAge = Math.floor((today - new Date(d.child.birthDate)) / (1000 * 60 * 60 * 24 * 30.44));

            return {
                childId: d.child.id,
                childName: d.child.fullName,
                parentName: d.child.parentName,
                ward: d.child.wardNumber,
                phoneNumber: d.child.phoneNumber,
                vaccine: d.vaccineType.name,
                doseNumber: d.doseNumber,
                dueDate: d.dueDate,
                daysOverdue,
                childAgeMonths: childAge,
                notificationSent: d.notificationSent
            };
        });

        res.json({
            success: true,
            data: {
                totalDefaulters: defaulters.length,
                defaulters: defaulterSummary,
                criteria: { daysOverdue: overdueDays, ward: wardNumber, vaccine: sanitizedVaccine }
            }
        });
    } catch (error) {
        handleError(res, error, 'Defaulter tracking');
    }
};

// --- Catch-up campaign analysis ---
export const getCatchUpAnalysis = async (req, res) => {
    try {
        const { ward, startDate, endDate } = req.query;

        const wardNumber = ValidationUtils.validateInteger(ward, 'ward number', 0);
        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');

        const catchUpVaccines = await prisma.childDueVaccine.findMany({
            where: {
                isCatchUp: true,
                ...(startDateObj ? { createdAt: { gte: startDateObj } } : {}),
                ...(endDateObj ? { createdAt: { lte: endDateObj } } : {}),
                child: wardNumber ? { wardNumber } : undefined
            },
            include: {
                child: { select: { wardNumber: true, birthDate: true } },
                vaccineType: { select: { name: true } }
            }
        });

        const catchUpStats = {
            total: catchUpVaccines.length,
            completed: catchUpVaccines.filter(v => v.isCompleted).length,
            pending: catchUpVaccines.filter(v => !v.isCompleted).length,
            byVaccine: {}
        };

        // Group by vaccine type
        catchUpVaccines.forEach(vaccine => {
            const vaccineName = vaccine.vaccineType.name;
            if (!catchUpStats.byVaccine[vaccineName]) {
                catchUpStats.byVaccine[vaccineName] = { total: 0, completed: 0, pending: 0 };
            }
            catchUpStats.byVaccine[vaccineName].total++;
            if (vaccine.isCompleted) {
                catchUpStats.byVaccine[vaccineName].completed++;
            } else {
                catchUpStats.byVaccine[vaccineName].pending++;
            }
        });

        const completionRate = catchUpStats.total > 0 ?
            ((catchUpStats.completed / catchUpStats.total) * 100).toFixed(2) : '0';

        res.json({
            success: true,
            data: {
                ...catchUpStats,
                completionRate: `${completionRate}%`
            }
        });
    } catch (error) {
        handleError(res, error, 'Catch-up analysis');
    }
};

// --- Mother vaccination (TD) analysis ---
export const getTDAnalysis = async (req, res) => {
    try {
        const { ward, startDate, endDate } = req.query;

        const wardNumber = ValidationUtils.validateInteger(ward, 'ward number', 0);
        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');

        const motherWhere = {
            ...(wardNumber ? { wardNumber } : {}),
        };

        const tdWhere = {
            ...(startDateObj ? { dateGiven: { gte: startDateObj } } : {}),
            ...(endDateObj ? { dateGiven: { lte: endDateObj } } : {}),
        };

        const mothers = await prisma.mother.findMany({
            where: motherWhere,
            include: {
                tdDoses: {
                    where: tdWhere,
                    orderBy: { dateGiven: 'asc' }
                }
            }
        });

        const tdStats = {
            totalMothers: mothers.length,
            vaccinatedMothers: mothers.filter(m => m.tdDoses.length > 0).length,
            totalTDDoses: mothers.reduce((sum, m) => sum + m.tdDoses.length, 0),
            doseDistribution: {
                dose1: 0,
                dose2: 0,
                booster: 0
            },
            ageGroups: {
                '15-20': { total: 0, vaccinated: 0 },
                '21-25': { total: 0, vaccinated: 0 },
                '26-30': { total: 0, vaccinated: 0 },
                '31-35': { total: 0, vaccinated: 0 },
                '35+': { total: 0, vaccinated: 0 }
            }
        };

        mothers.forEach(mother => {
            // Age group classification
            let ageGroup;
            if (mother.age <= 20) ageGroup = '15-20';
            else if (mother.age <= 25) ageGroup = '21-25';
            else if (mother.age <= 30) ageGroup = '26-30';
            else if (mother.age <= 35) ageGroup = '31-35';
            else ageGroup = '35+';

            tdStats.ageGroups[ageGroup].total++;
            if (mother.tdDoses.length > 0) {
                tdStats.ageGroups[ageGroup].vaccinated++;
            }

            // Dose distribution
            mother.tdDoses.forEach(dose => {
                if (dose.doseNumber === 1) tdStats.doseDistribution.dose1++;
                else if (dose.doseNumber === 2) tdStats.doseDistribution.dose2++;
                else tdStats.doseDistribution.booster++;
            });
        });

        const coverageRate = tdStats.totalMothers > 0 ?
            ((tdStats.vaccinatedMothers / tdStats.totalMothers) * 100).toFixed(2) : '0';

        // Calculate coverage by age group
        Object.keys(tdStats.ageGroups).forEach(ageGroup => {
            const group = tdStats.ageGroups[ageGroup];
            group.coveragePercentage = group.total > 0 ?
                ((group.vaccinated / group.total) * 100).toFixed(2) : '0';
        });

        res.json({
            success: true,
            data: {
                ...tdStats,
                overallCoverage: `${coverageRate}%`
            }
        });
    } catch (error) {
        handleError(res, error, 'TD analysis');
    }
};

// --- Notification effectiveness ---
export const getNotificationAnalysis = async (req, res) => {
    try {
        const { ward, startDate, endDate, type = 'both' } = req.query;

        const wardNumber = ValidationUtils.validateInteger(ward, 'ward number', 0);
        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');

        const validTypes = ['child', 'mother', 'both'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ success: false, error: 'Invalid type. Use: child, mother, both' });
        }

        const notificationWhere = {
            ...(startDateObj ? { sentAt: { gte: startDateObj } } : {}),
            ...(endDateObj ? { sentAt: { lte: endDateObj } } : {}),
        };

        if (type === 'child') notificationWhere.childId = { not: null };
        if (type === 'mother') notificationWhere.motherId = { not: null };

        const notifications = await prisma.notificationLog.findMany({
            where: notificationWhere,
            include: {
                child: wardNumber ? { select: { wardNumber: true } } : true,
                mother: wardNumber ? { select: { wardNumber: true } } : true
            }
        });

        // Filter by ward if specified
        const filteredNotifications = wardNumber ?
            notifications.filter(n =>
                (n.child && n.child.wardNumber === wardNumber) ||
                (n.mother && n.mother.wardNumber === wardNumber)
            ) : notifications;

        // Get vaccination records after notifications to measure effectiveness
        const dueVaccinesWithNotifications = await prisma.childDueVaccine.findMany({
            where: {
                notificationSent: true,
                ...(wardNumber ? { child: { wardNumber } } : {}),
            }
        });

        const notificationStats = {
            totalNotificationsSent: filteredNotifications.length,
            childNotifications: filteredNotifications.filter(n => n.childId).length,
            motherNotifications: filteredNotifications.filter(n => n.motherId).length,
            notificationsWithResponse: dueVaccinesWithNotifications.filter(d => d.isCompleted).length,
            totalNotified: dueVaccinesWithNotifications.length,
        };

        const responseRate = notificationStats.totalNotified > 0 ?
            ((notificationStats.notificationsWithResponse / notificationStats.totalNotified) * 100).toFixed(2) : '0';

        res.json({
            success: true,
            data: {
                ...notificationStats,
                responseRate: `${responseRate}%`
            }
        });
    } catch (error) {
        handleError(res, error, 'Notification analysis');
    }
};

// --- Weight tracking analysis ---
export const getWeightAnalysis = async (req, res) => {
    try {
        const { ward, startDate, endDate, ageGroup } = req.query;

        const wardNumber = ValidationUtils.validateInteger(ward, 'ward number', 0);
        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');

        const weightRecords = await prisma.weightRecord.findMany({
            where: {
                ...(startDateObj ? { date: { gte: startDateObj } } : {}),
                ...(endDateObj ? { date: { lte: endDateObj } } : {}),
                child: wardNumber ? { wardNumber } : undefined
            },
            include: {
                child: {
                    select: {
                        id: true,
                        fullName: true,
                        wardNumber: true,
                        birthDate: true,
                        gender: true
                    }
                }
            },
            orderBy: { date: 'asc' }
        });

        const weightStats = {
            totalRecords: weightRecords.length,
            uniqueChildren: new Set(weightRecords.map(r => r.childId)).size,
            averageWeight: 0,
            weightRanges: {
                underweight: 0,
                normal: 0,
                overweight: 0
            },
            byAgeGroup: {},
            growthTrends: []
        };

        // Calculate averages and categorize
        if (weightRecords.length > 0) {
            const totalWeight = weightRecords.reduce((sum, r) => sum + r.weight, 0);
            weightStats.averageWeight = (totalWeight / weightRecords.length).toFixed(2);

            weightRecords.forEach(record => {
                const ageInMonths = Math.floor(
                    (new Date(record.date) - new Date(record.child.birthDate)) /
                    (1000 * 60 * 60 * 24 * 30.44)
                );

                let ageCategory;
                if (ageInMonths <= 6) ageCategory = '0-6 months';
                else if (ageInMonths <= 12) ageCategory = '6-12 months';
                else if (ageInMonths <= 24) ageCategory = '1-2 years';
                else if (ageInMonths <= 60) ageCategory = '2-5 years';
                else ageCategory = '5+ years';

                if (!weightStats.byAgeGroup[ageCategory]) {
                    weightStats.byAgeGroup[ageCategory] = {
                        count: 0,
                        averageWeight: 0,
                        totalWeight: 0
                    };
                }

                weightStats.byAgeGroup[ageCategory].count++;
                weightStats.byAgeGroup[ageCategory].totalWeight += record.weight;
            });

            // Calculate averages for age groups
            Object.keys(weightStats.byAgeGroup).forEach(ageGroup => {
                const group = weightStats.byAgeGroup[ageGroup];
                group.averageWeight = (group.totalWeight / group.count).toFixed(2);
                delete group.totalWeight; // Clean up
            });
        }

        res.json({ success: true, data: weightStats });
    } catch (error) {
        handleError(res, error, 'Weight analysis');
    }
};
// REALISTIC ANALYTICS BASED ON YOUR ACTUAL PRISMA SCHEMA

// =============================================================================
// REGISTRATION & ENROLLMENT ANALYTICS
// =============================================================================

// --- Registration trends analysis ---
export const getRegistrationTrends = async (req, res) => {
    try {
        const { type = 'child', interval = 'month', startDate, endDate, ward } = req.query;

        const wardNumber = ValidationUtils.validateInteger(ward, 'ward number', 0);
        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');

        if (!['child', 'mother', 'both'].includes(type)) {
            return res.status(400).json({ success: false, error: 'Invalid type. Use: child, mother, both' });
        }

        if (!SAFE_INTERVALS.includes(interval)) {
            return res.status(400).json({ success: false, error: 'Invalid interval. Use: month, quarter, year' });
        }

        const whereClause = {
            ...(wardNumber ? { wardNumber } : {}),
            ...(startDateObj ? { createdAt: { gte: startDateObj } } : {}),
            ...(endDateObj ? { createdAt: { lte: endDateObj } } : {}),
        };

        let childRegistrations = [];
        let motherRegistrations = [];

        if (type === 'child' || type === 'both') {
            childRegistrations = await prisma.child.findMany({
                where: whereClause,
                select: { createdAt: true, wardNumber: true, createdById: true, isFromOtherMunicipality: true }
            });
        }

        if (type === 'mother' || type === 'both') {
            motherRegistrations = await prisma.mother.findMany({
                where: whereClause,
                select: { createdAt: true, wardNumber: true, createdById: true, isFromOtherMunicipality: true }
            });
        }

        const buckets = {};
        const processRegistrations = (records, recordType) => {
            records.forEach(record => {
                const date = new Date(record.createdAt);
                let key = '';
                if (interval === 'month') key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                else if (interval === 'quarter') key = `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
                else key = `${date.getFullYear()}`;

                if (!buckets[key]) {
                    buckets[key] = {
                        period: key,
                        totalRegistrations: 0,
                        childRegistrations: 0,
                        motherRegistrations: 0,
                        localRegistrations: 0,
                        externalRegistrations: 0,
                        byWard: {}
                    };
                }

                buckets[key].totalRegistrations++;
                buckets[key][`${recordType}Registrations`]++;

                if (record.isFromOtherMunicipality) {
                    buckets[key].externalRegistrations++;
                } else {
                    buckets[key].localRegistrations++;
                }

                const ward = record.wardNumber;
                if (!buckets[key].byWard[ward]) buckets[key].byWard[ward] = 0;
                buckets[key].byWard[ward]++;
            });
        };

        processRegistrations(childRegistrations, 'child');
        processRegistrations(motherRegistrations, 'mother');

        const result = Object.values(buckets).sort((a, b) => a.period.localeCompare(b.period));

        res.json({ success: true, data: result });
    } catch (error) {
        handleError(res, error, 'Registration trends analysis');
    }
};

// --- User productivity analysis ---
export const getUserProductivity = async (req, res) => {
    try {
        const { startDate, endDate, ward } = req.query;

        const wardNumber = ValidationUtils.validateInteger(ward, 'ward number', 0);
        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');

        const dateFilter = {
            ...(startDateObj ? { gte: startDateObj } : {}),
            ...(endDateObj ? { lte: endDateObj } : {})
        };

        const wardFilter = wardNumber ? { wardNumber } : {};

        const [childRegistrations, motherRegistrations, vaccinations, weightRecords, tdDoses, users] = await Promise.all([
            prisma.child.findMany({
                where: {
                    ...wardFilter,
                    createdAt: dateFilter
                },
                select: { createdById: true, wardNumber: true, createdAt: true }
            }),
            prisma.mother.findMany({
                where: {
                    ...wardFilter,
                    createdAt: dateFilter
                },
                select: { createdById: true, wardNumber: true, createdAt: true }
            }),
            prisma.vaccinationRecord.findMany({
                where: {
                    dateGiven: dateFilter,
                    ...(wardNumber ? { wardOfVaccination: wardNumber } : {})
                },
                select: { administeredById: true, createdById: true, wardOfVaccination: true, dateGiven: true }
            }),
            prisma.weightRecord.findMany({
                where: {
                    date: dateFilter,
                    ...(wardNumber ? { wardOfVaccination: wardNumber } : {})
                },
                select: { administeredById: true, createdById: true, wardOfVaccination: true, date: true }
            }),
            prisma.tdDose.findMany({
                where: {
                    dateGiven: dateFilter
                },
                include: {
                    mother: { select: { wardNumber: true } }
                }
            }),
            prisma.user.findMany({
                select: { id: true, name: true, role: true, status: true }
            })
        ]);

        const userMap = Object.fromEntries(users.map(u => [u.id, { name: u.name, role: u.role, status: u.status }]));
        const userStats = {};

        // Initialize user stats
        users.forEach(user => {
            userStats[user.id] = {
                userId: user.id,
                userName: user.name,
                userRole: user.role,
                status: user.status,
                childRegistrations: 0,
                motherRegistrations: 0,
                vaccinationsAdministered: 0,
                vaccinationsCreated: 0,
                weightRecordsAdministered: 0,
                weightRecordsCreated: 0,
                tdDosesAdministered: 0,
                tdDosesCreated: 0,
                totalActivities: 0,
                wardsWorked: new Set()
            };
        });

        // Count child registrations
        childRegistrations.forEach(child => {
            if (userStats[child.createdById]) {
                userStats[child.createdById].childRegistrations++;
                userStats[child.createdById].totalActivities++;
                userStats[child.createdById].wardsWorked.add(child.wardNumber);
            }
        });

        // Count mother registrations
        motherRegistrations.forEach(mother => {
            if (userStats[mother.createdById]) {
                userStats[mother.createdById].motherRegistrations++;
                userStats[mother.createdById].totalActivities++;
                userStats[mother.createdById].wardsWorked.add(mother.wardNumber);
            }
        });

        // Count vaccinations
        vaccinations.forEach(vac => {
            if (vac.administeredById && userStats[vac.administeredById]) {
                userStats[vac.administeredById].vaccinationsAdministered++;
                userStats[vac.administeredById].totalActivities++;
                userStats[vac.administeredById].wardsWorked.add(vac.wardOfVaccination);
            }
            if (userStats[vac.createdById]) {
                userStats[vac.createdById].vaccinationsCreated++;
                userStats[vac.createdById].totalActivities++;
                userStats[vac.createdById].wardsWorked.add(vac.wardOfVaccination);
            }
        });

        // Count weight records
        weightRecords.forEach(weight => {
            if (weight.administeredById && userStats[weight.administeredById]) {
                userStats[weight.administeredById].weightRecordsAdministered++;
                userStats[weight.administeredById].totalActivities++;
                userStats[weight.administeredById].wardsWorked.add(weight.wardOfVaccination);
            }
            if (userStats[weight.createdById]) {
                userStats[weight.createdById].weightRecordsCreated++;
                userStats[weight.createdById].totalActivities++;
                userStats[weight.createdById].wardsWorked.add(weight.wardOfVaccination);
            }
        });

        // Count TD doses
        tdDoses.forEach(td => {
            if (userStats[td.administeredById]) {
                userStats[td.administeredById].tdDosesAdministered++;
                userStats[td.administeredById].totalActivities++;
                userStats[td.administeredById].wardsWorked.add(td.mother.wardNumber);
            }
            if (userStats[td.createdById]) {
                userStats[td.createdById].tdDosesCreated++;
                userStats[td.createdById].totalActivities++;
                userStats[td.createdById].wardsWorked.add(td.mother.wardNumber);
            }
        });

        // Convert Set to count and filter active users
        const result = Object.values(userStats)
            .map(stat => ({
                ...stat,
                wardsWorked: stat.wardsWorked.size
            }))
            .filter(stat => stat.totalActivities > 0 || stat.status === 'ACTIVE')
            .sort((a, b) => b.totalActivities - a.totalActivities);

        res.json({ success: true, data: result });
    } catch (error) {
        handleError(res, error, 'User productivity analysis');
    }
};

// --- Data quality analysis ---
export const getDataQuality = async (req, res) => {
    try {
        const { ward, type = 'child' } = req.query;

        const wardNumber = ValidationUtils.validateInteger(ward, 'ward number', 0);

        if (!['child', 'mother'].includes(type)) {
            return res.status(400).json({ success: false, error: 'Invalid type. Use: child, mother' });
        }

        let qualityData;

        if (type === 'child') {
            const children = await prisma.child.findMany({
                where: wardNumber ? { wardNumber } : {},
                select: {
                    id: true,
                    fullName: true,
                    parentName: true,
                    phoneNumber: true,
                    email: true,
                    birthDate: true,
                    casteCode: true,
                    gender: true,
                    tole: true,
                    wardNumber: true,
                    verifiedById: true,
                    purnaKhop: true,
                    remarks: true,
                    createdAt: true
                }
            });

            let completeRecords = 0;
            let verifiedRecords = 0;
            let withRemarks = 0;
            let withEmail = 0;
            let purnaKhopTrue = 0;

            const fieldCompleteness = {
                fullName: 0,
                parentName: 0,
                phoneNumber: 0,
                gender: 0,
                tole: 0,
                email: 0,
                casteCode: 0
            };

            children.forEach(child => {
                let completeFieldCount = 0;

                // Check required fields
                if (child.fullName && child.fullName.trim()) {
                    fieldCompleteness.fullName++;
                    completeFieldCount++;
                }
                if (child.parentName && child.parentName.trim()) {
                    fieldCompleteness.parentName++;
                    completeFieldCount++;
                }
                if (child.phoneNumber && child.phoneNumber.trim()) {
                    fieldCompleteness.phoneNumber++;
                    completeFieldCount++;
                }
                if (child.gender && child.gender.trim()) {
                    fieldCompleteness.gender++;
                    completeFieldCount++;
                }
                if (child.tole && child.tole.trim()) {
                    fieldCompleteness.tole++;
                    completeFieldCount++;
                }

                // Check optional fields
                if (child.email && child.email.trim()) {
                    fieldCompleteness.email++;
                    withEmail++;
                }
                if (child.casteCode) {
                    fieldCompleteness.casteCode++;
                }

                // Count complete records (all required fields filled)
                if (completeFieldCount >= 5) {
                    completeRecords++;
                }

                if (child.verifiedById) verifiedRecords++;
                if (child.remarks && child.remarks.trim()) withRemarks++;
                if (child.purnaKhop) purnaKhopTrue++;
            });

            // Calculate percentages
            const total = children.length;
            Object.keys(fieldCompleteness).forEach(field => {
                fieldCompleteness[field] = {
                    count: fieldCompleteness[field],
                    percentage: total > 0 ? ((fieldCompleteness[field] / total) * 100).toFixed(2) : '0'
                };
            });

            qualityData = {
                totalRecords: total,
                completeRecords,
                completenessPercentage: total > 0 ? ((completeRecords / total) * 100).toFixed(2) : '0',
                verifiedRecords,
                verificationPercentage: total > 0 ? ((verifiedRecords / total) * 100).toFixed(2) : '0',
                withEmail,
                withRemarks,
                purnaKhopTrue,
                fieldCompleteness
            };
        } else {
            // Mother data quality
            const mothers = await prisma.mother.findMany({
                where: wardNumber ? { wardNumber } : {},
                select: {
                    id: true,
                    name: true,
                    age: true,
                    phoneNumber: true,
                    tole: true,
                    casteCode: true,
                    pregnancyCount: true,
                    previousTDTakenCount: true,
                    wardNumber: true,
                    remarks: true,
                    createdAt: true
                }
            });

            let completeRecords = 0;
            let withRemarks = 0;

            const fieldCompleteness = {
                name: 0,
                age: 0,
                phoneNumber: 0,
                tole: 0,
                pregnancyCount: 0,
                previousTDTakenCount: 0,
                casteCode: 0
            };

            mothers.forEach(mother => {
                let completeFieldCount = 0;

                if (mother.name && mother.name.trim()) {
                    fieldCompleteness.name++;
                    completeFieldCount++;
                }
                if (mother.age && mother.age > 0) {
                    fieldCompleteness.age++;
                    completeFieldCount++;
                }
                if (mother.phoneNumber && mother.phoneNumber.trim()) {
                    fieldCompleteness.phoneNumber++;
                    completeFieldCount++;
                }
                if (mother.tole && mother.tole.trim()) {
                    fieldCompleteness.tole++;
                    completeFieldCount++;
                }
                if (mother.pregnancyCount !== null && mother.pregnancyCount >= 0) {
                    fieldCompleteness.pregnancyCount++;
                    completeFieldCount++;
                }
                if (mother.previousTDTakenCount !== null && mother.previousTDTakenCount >= 0) {
                    fieldCompleteness.previousTDTakenCount++;
                }
                if (mother.casteCode) {
                    fieldCompleteness.casteCode++;
                }

                if (completeFieldCount >= 5) completeRecords++;
                if (mother.remarks && mother.remarks.trim()) withRemarks++;
            });

            const total = mothers.length;
            Object.keys(fieldCompleteness).forEach(field => {
                fieldCompleteness[field] = {
                    count: fieldCompleteness[field],
                    percentage: total > 0 ? ((fieldCompleteness[field] / total) * 100).toFixed(2) : '0'
                };
            });

            qualityData = {
                totalRecords: total,
                completeRecords,
                completenessPercentage: total > 0 ? ((completeRecords / total) * 100).toFixed(2) : '0',
                withRemarks,
                fieldCompleteness
            };
        }

        res.json({ success: true, data: qualityData });
    } catch (error) {
        handleError(res, error, 'Data quality analysis');
    }
};

// =============================================================================
// VACCINATION PROGRAM ANALYTICS
// =============================================================================

// --- Dose completion analysis ---
export const getDoseCompletionAnalysis = async (req, res) => {
    try {
        const { vaccineId, ward, startDate, endDate } = req.query;

        const vaccineIdNum = ValidationUtils.validateInteger(vaccineId, 'vaccine ID', 1);
        const wardNumber = ValidationUtils.validateInteger(ward, 'ward number', 0);
        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');

        const whereClause = {
            ...(vaccineIdNum ? { vaccineTypeId: vaccineIdNum } : {}),
            ...(startDateObj ? { dateGiven: { gte: startDateObj } } : {}),
            ...(endDateObj ? { dateGiven: { lte: endDateObj } } : {})
        };

        const [vaccinations, vaccineTypes] = await Promise.all([
            prisma.vaccinationRecord.findMany({
                where: whereClause,
                include: {
                    child: wardNumber ? { where: { wardNumber } } : true,
                    vaccineType: { select: { name: true } }
                }
            }),
            prisma.vaccineType.findMany({
                where: vaccineIdNum ? { id: vaccineIdNum } : {},
                select: { id: true, name: true }
            })
        ]);

        // Filter by ward if specified
        const filteredVaccinations = wardNumber ?
            vaccinations.filter(v => v.child && v.child.wardNumber === wardNumber) :
            vaccinations;

        // Group by vaccine and dose
        const doseAnalysis = {};

        filteredVaccinations.forEach(vac => {
            const vaccineKey = `${vac.vaccineType.name}`;
            if (!doseAnalysis[vaccineKey]) {
                doseAnalysis[vaccineKey] = {};
            }

            const doseKey = `dose_${vac.doseNumber}`;
            if (!doseAnalysis[vaccineKey][doseKey]) {
                doseAnalysis[vaccineKey][doseKey] = {
                    doseNumber: vac.doseNumber,
                    count: 0,
                    children: new Set()
                };
            }

            doseAnalysis[vaccineKey][doseKey].count++;
            doseAnalysis[vaccineKey][doseKey].children.add(vac.citizenId);
        });

        // Calculate completion rates and dropoffs
        const completionData = Object.entries(doseAnalysis).map(([vaccineName, doses]) => {
            const sortedDoses = Object.values(doses)
                .sort((a, b) => a.doseNumber - b.doseNumber)
                .map(dose => ({
                    doseNumber: dose.doseNumber,
                    count: dose.count,
                    uniqueChildren: dose.children.size
                }));

            // Calculate dropout rates
            const dropoutRates = [];
            for (let i = 1; i < sortedDoses.length; i++) {
                const previousDose = sortedDoses[i - 1];
                const currentDose = sortedDoses[i];
                const dropoutRate = previousDose.uniqueChildren > 0 ?
                    (((previousDose.uniqueChildren - currentDose.uniqueChildren) / previousDose.uniqueChildren) * 100).toFixed(2) : '0';
                dropoutRates.push({
                    fromDose: previousDose.doseNumber,
                    toDose: currentDose.doseNumber,
                    dropoutRate: `${dropoutRate}%`,
                    childrenLost: previousDose.uniqueChildren - currentDose.uniqueChildren
                });
            }

            return {
                vaccineName,
                doseBreakdown: sortedDoses,
                dropoutAnalysis: dropoutRates,
                totalDoses: sortedDoses.reduce((sum, dose) => sum + dose.count, 0),
                totalUniqueChildren: Math.max(...sortedDoses.map(d => d.uniqueChildren), 0)
            };
        });

        res.json({ success: true, data: completionData });
    } catch (error) {
        handleError(res, error, 'Dose completion analysis');
    }
};

// --- Due vaccine management analysis ---
export const getDueVaccineAnalysis = async (req, res) => {
    try {
        const { ward, status = 'all', daysOverdue = 0 } = req.query;

        const wardNumber = ValidationUtils.validateInteger(ward, 'ward number', 0);
        const overdueDays = ValidationUtils.validateInteger(daysOverdue, 'days overdue', 0);

        const validStatuses = ['all', 'completed', 'pending', 'overdue'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        const today = new Date();
        const overdueDate = new Date();
        overdueDate.setDate(today.getDate() - overdueDays);

        let whereClause = {};

        if (status === 'completed') whereClause.isCompleted = true;
        if (status === 'pending') whereClause.isCompleted = false;
        if (status === 'overdue') {
            whereClause.isCompleted = false;
            whereClause.dueDate = { lt: overdueDate };
        }

        const dueVaccines = await prisma.childDueVaccine.findMany({
            where: {
                ...whereClause,
                child: wardNumber ? { wardNumber } : undefined
            },
            include: {
                child: {
                    select: {
                        id: true,
                        fullName: true,
                        wardNumber: true,
                        phoneNumber: true,
                        birthDate: true,
                        parentName: true
                    }
                },
                vaccineType: {
                    select: { name: true }
                }
            },
            orderBy: { dueDate: 'asc' }
        });

        // Categorize and analyze
        const analysis = {
            total: dueVaccines.length,
            completed: dueVaccines.filter(d => d.isCompleted).length,
            pending: dueVaccines.filter(d => !d.isCompleted).length,
            overdue: dueVaccines.filter(d => !d.isCompleted && d.dueDate < today).length,
            notificationsSent: dueVaccines.filter(d => d.notificationSent).length,
            correctivesSent: dueVaccines.filter(d => d.correctiveSent).length,
            catchUp: dueVaccines.filter(d => d.isCatchUp).length,
            byVaccine: {},
            byWard: {}
        };

        dueVaccines.forEach(due => {
            // Group by vaccine
            const vaccineName = due.vaccineType.name;
            if (!analysis.byVaccine[vaccineName]) {
                analysis.byVaccine[vaccineName] = {
                    total: 0,
                    completed: 0,
                    pending: 0,
                    overdue: 0
                };
            }
            analysis.byVaccine[vaccineName].total++;
            if (due.isCompleted) analysis.byVaccine[vaccineName].completed++;
            else analysis.byVaccine[vaccineName].pending++;
            if (!due.isCompleted && due.dueDate < today) analysis.byVaccine[vaccineName].overdue++;

            // Group by ward
            const ward = due.child.wardNumber;
            if (!analysis.byWard[ward]) {
                analysis.byWard[ward] = {
                    total: 0,
                    completed: 0,
                    pending: 0,
                    overdue: 0
                };
            }
            analysis.byWard[ward].total++;
            if (due.isCompleted) analysis.byWard[ward].completed++;
            else analysis.byWard[ward].pending++;
            if (!due.isCompleted && due.dueDate < today) analysis.byWard[ward].overdue++;
        });

        // Add detailed records for specific status requests
        let detailedRecords = [];
        if (status !== 'all') {
            detailedRecords = dueVaccines.map(due => ({
                childId: due.child.id,
                childName: due.child.fullName,
                parentName: due.child.parentName,
                ward: due.child.wardNumber,
                phoneNumber: due.child.phoneNumber,
                vaccine: due.vaccineType.name,
                doseNumber: due.doseNumber,
                dueDate: due.dueDate,
                isCompleted: due.isCompleted,
                notificationSent: due.notificationSent,
                correctiveSent: due.correctiveSent,
                isCatchUp: due.isCatchUp,
                daysOverdue: !due.isCompleted && due.dueDate < today ?
                    Math.floor((today - due.dueDate) / (1000 * 60 * 60 * 24)) : 0
            }));
        }

        res.json({
            success: true,
            data: {
                summary: analysis,
                records: detailedRecords,
                filterApplied: { status, ward: wardNumber, daysOverdue }
            }
        });
    } catch (error) {
        handleError(res, error, 'Due vaccine analysis');
    }
};

// --- Weight tracking insights ---
export const getWeightInsights = async (req, res) => {
    try {
        const { ward, startDate, endDate, ageGroup } = req.query;

        const wardNumber = ValidationUtils.validateInteger(ward, 'ward number', 0);
        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');

        const whereClause = {
            ...(startDateObj ? { date: { gte: startDateObj } } : {}),
            ...(endDateObj ? { date: { lte: endDateObj } } : {}),
            ...(wardNumber ? { wardOfVaccination: wardNumber } : {})
        };

        const weightRecords = await prisma.weightRecord.findMany({
            where: whereClause,
            include: {
                child: {
                    select: {
                        id: true,
                        fullName: true,
                        wardNumber: true,
                        birthDate: true,
                        gender: true
                    }
                }
            },
            orderBy: [
                { childId: 'asc' },
                { date: 'asc' }
            ]
        });

        const insights = {
            totalRecords: weightRecords.length,
            uniqueChildren: new Set(weightRecords.map(r => r.childId)).size,
            averageWeight: 0,
            weightTrends: {},
            ageGroupAnalysis: {},
            genderAnalysis: { male: { count: 0, totalWeight: 0 }, female: { count: 0, totalWeight: 0 } },
            growthTracking: []
        };

        if (weightRecords.length > 0) {
            // Calculate overall average
            const totalWeight = weightRecords.reduce((sum, r) => sum + r.weight, 0);
            insights.averageWeight = (totalWeight / weightRecords.length).toFixed(2);

            // Group by child for growth tracking
            const childWeights = {};

            weightRecords.forEach(record => {
                const childId = record.childId;
                if (!childWeights[childId]) {
                    childWeights[childId] = {
                        child: record.child,
                        weights: []
                    };
                }
                childWeights[childId].weights.push({
                    date: record.date,
                    weight: record.weight
                });

                // Age group analysis
                const today = new Date(record.date);
                const ageInMonths = Math.floor(
                    (today - new Date(record.child.birthDate)) / (1000 * 60 * 60 * 24 * 30.44)
                );

                let ageCategory;
                if (ageInMonths <= 6) ageCategory = '0-6 months';
                else if (ageInMonths <= 12) ageCategory = '6-12 months';
                else if (ageInMonths <= 24) ageCategory = '1-2 years';
                else if (ageInMonths <= 60) ageCategory = '2-5 years';
                else ageCategory = '5+ years';

                if (!insights.ageGroupAnalysis[ageCategory]) {
                    insights.ageGroupAnalysis[ageCategory] = {
                        count: 0,
                        totalWeight: 0,
                        averageWeight: 0
                    };
                }
                insights.ageGroupAnalysis[ageCategory].count++;
                insights.ageGroupAnalysis[ageCategory].totalWeight += record.weight;

                // Gender analysis
                const gender = record.child.gender.toLowerCase();
                if (insights.genderAnalysis[gender]) {
                    insights.genderAnalysis[gender].count++;
                    insights.genderAnalysis[gender].totalWeight += record.weight;
                }
            });

            // Calculate averages for age groups
            Object.keys(insights.ageGroupAnalysis).forEach(ageGroup => {
                const group = insights.ageGroupAnalysis[ageGroup];
                group.averageWeight = (group.totalWeight / group.count).toFixed(2);
                delete group.totalWeight; // Clean up
            });

            // Calculate gender averages
            Object.keys(insights.genderAnalysis).forEach(gender => {
                const group = insights.genderAnalysis[gender];
                if (group.count > 0) {
                    group.averageWeight = (group.totalWeight / group.count).toFixed(2);
                    delete group.totalWeight;
                }
            });

            // Growth tracking for children with multiple records
            insights.growthTracking = Object.values(childWeights)
                .filter(child => child.weights.length > 1)
                .map(child => {
                    const sortedWeights = child.weights.sort((a, b) => new Date(a.date) - new Date(b.date));
                    const firstWeight = sortedWeights[0];
                    const lastWeight = sortedWeights[sortedWeights.length - 1];
                    const weightChange = lastWeight.weight - firstWeight.weight;
                    const daysBetween = Math.floor((new Date(lastWeight.date) - new Date(firstWeight.date)) / (1000 * 60 * 60 * 24));

                    return {
                        childId: child.child.id,
                        childName: child.child.fullName,
                        ward: child.child.wardNumber,
                        recordCount: sortedWeights.length,
                        firstWeight: firstWeight.weight,
                        lastWeight: lastWeight.weight,
                        weightChange: parseFloat(weightChange.toFixed(2)),
                        daysBetween,
                        averageGrowthPerDay: daysBetween > 0 ? parseFloat((weightChange / daysBetween).toFixed(4)) : 0
                    };
                })
                .sort((a, b) => Math.abs(b.weightChange) - Math.abs(a.weightChange));
        }

        res.json({ success: true, data: insights });
    } catch (error) {
        handleError(res, error, 'Weight insights analysis');
    }
};

// =============================================================================
// SYSTEM & AUDIT ANALYTICS
// =============================================================================

// --- Audit log analysis ---
export const getAuditAnalysis = async (req, res) => {
    try {
        const { startDate, endDate, userId, action } = req.query;

        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');
        const userIdNum = ValidationUtils.validateInteger(userId, 'user ID', 1);
        const sanitizedAction = ValidationUtils.validateString(action, 'action');

        const whereClause = {
            ...(startDateObj ? { createdAt: { gte: startDateObj } } : {}),
            ...(endDateObj ? { createdAt: { lte: endDateObj } } : {}),
            ...(userIdNum ? { userId: userIdNum } : {}),
            ...(sanitizedAction ? { action: { contains: sanitizedAction, mode: 'insensitive' } } : {})
        };

        const [auditLogs, users] = await Promise.all([
            prisma.auditLog.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                take: 1000 // Limit for performance
            }),
            prisma.user.findMany({
                select: { id: true, name: true, role: true }
            })
        ]);

        const userMap = Object.fromEntries(users.map(u => [u.id, { name: u.name, role: u.role }]));

        const analysis = {
            totalLogs: auditLogs.length,
            actionBreakdown: {},
            userActivity: {},
            timePatterns: {
                hourly: Array(24).fill(0),
                daily: {},
                monthly: {}
            },
            recentActivity: []
        };

        auditLogs.forEach(log => {
            // Action breakdown
            analysis.actionBreakdown[log.action] = (analysis.actionBreakdown[log.action] || 0) + 1;

            // User activity
            if (!analysis.userActivity[log.userId]) {
                analysis.userActivity[log.userId] = {
                    userId: log.userId,
                    userName: userMap[log.userId]?.name || 'Unknown',
                    userRole: userMap[log.userId]?.role || 'Unknown',
                    actionCount: 0,
                    actions: {}
                };
            }
            analysis.userActivity[log.userId].actionCount++;
            analysis.userActivity[log.userId].actions[log.action] =
                (analysis.userActivity[log.userId].actions[log.action] || 0) + 1;

            // Time patterns
            const date = new Date(log.createdAt);
            const hour = date.getHours();
            const dayKey = date.toISOString().split('T')[0];
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            analysis.timePatterns.hourly[hour]++;
            analysis.timePatterns.daily[dayKey] = (analysis.timePatterns.daily[dayKey] || 0) + 1;
            analysis.timePatterns.monthly[monthKey] = (analysis.timePatterns.monthly[monthKey] || 0) + 1;
        });

        // Format recent activity
        analysis.recentActivity = auditLogs.slice(0, 50).map(log => ({
            timestamp: log.createdAt,
            action: log.action,
            userId: log.userId,
            userName: userMap[log.userId]?.name || 'Unknown',
            meta: log.meta
        }));

        // Convert objects to arrays for easier frontend consumption
        analysis.actionBreakdown = Object.entries(analysis.actionBreakdown)
            .map(([action, count]) => ({ action, count }))
            .sort((a, b) => b.count - a.count);

        analysis.userActivity = Object.values(analysis.userActivity)
            .sort((a, b) => b.actionCount - a.actionCount);

        analysis.timePatterns.daily = Object.entries(analysis.timePatterns.daily)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        analysis.timePatterns.monthly = Object.entries(analysis.timePatterns.monthly)
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => a.month.localeCompare(b.month));

        res.json({ success: true, data: analysis });
    } catch (error) {
        handleError(res, error, 'Audit analysis');
    }
};

// --- Authentication and security analysis ---
export const getSecurityAnalysis = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        const daysPeriod = ValidationUtils.validateInteger(days, 'days period', 1, 90);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysPeriod);

        const [refreshTokens, otps, users] = await Promise.all([
            prisma.refreshToken.findMany({
                where: { createdAt: { gte: startDate } },
                include: {
                    user: { select: { name: true, role: true } }
                }
            }),
            prisma.otp.findMany({
                where: { createdAt: { gte: startDate } },
                include: {
                    user: { select: { name: true, role: true } }
                }
            }),
            prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    role: true,
                    status: true,
                    createdAt: true
                }
            })
        ]);

        const securityMetrics = {
            totalUsers: users.length,
            activeUsers: users.filter(u => u.status === 'ACTIVE').length,
            pendingUsers: users.filter(u => u.status === 'PENDING').length,
            disabledUsers: users.filter(u => u.status === 'DISABLED').length,
            loginSessions: {
                total: refreshTokens.length,
                unique: new Set(refreshTokens.map(t => t.userId)).size,
                byDevice: {}
            },
            otpUsage: {
                total: otps.length,
                unique: new Set(otps.map(o => o.userId)).size,
                expired: otps.filter(o => new Date(o.expiresAt) < new Date()).length
            },
            usersByRole: {},
            recentLogins: [],
            securityEvents: []
        };

        // Device breakdown
        refreshTokens.forEach(token => {
            const device = token.device || 'Unknown';
            securityMetrics.loginSessions.byDevice[device] =
                (securityMetrics.loginSessions.byDevice[device] || 0) + 1;
        });

        // Users by role
        users.forEach(user => {
            securityMetrics.usersByRole[user.role] =
                (securityMetrics.usersByRole[user.role] || 0) + 1;
        });

        // Recent login activity
        securityMetrics.recentLogins = refreshTokens
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 20)
            .map(token => ({
                userId: token.userId,
                userName: token.user.name,
                userRole: token.user.role,
                device: token.device || 'Unknown',
                loginTime: token.createdAt,
                expiresAt: token.expiresAt
            }));

        // Security events (expired tokens, multiple OTPs, etc.)
        const expiredTokens = refreshTokens.filter(t => new Date(t.expiresAt) < new Date());
        const multipleOTPs = otps.reduce((acc, otp) => {
            acc[otp.userId] = (acc[otp.userId] || 0) + 1;
            return acc;
        }, {});

        securityMetrics.securityEvents = [
            ...expiredTokens.map(token => ({
                type: 'expired_token',
                userId: token.userId,
                userName: token.user.name,
                timestamp: token.expiresAt,
                details: `Token expired for device: ${token.device || 'Unknown'}`
            })),
            ...Object.entries(multipleOTPs)
                .filter(([, count]) => count > 3)
                .map(([userId, count]) => {
                    const user = users.find(u => u.id === parseInt(userId));
                    return {
                        type: 'multiple_otps',
                        userId: parseInt(userId),
                        userName: user?.name || 'Unknown',
                        timestamp: new Date(),
                        details: `${count} OTPs generated in ${daysPeriod} days`
                    };
                })
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Format device breakdown
        securityMetrics.loginSessions.byDevice = Object.entries(securityMetrics.loginSessions.byDevice)
            .map(([device, count]) => ({ device, count }))
            .sort((a, b) => b.count - a.count);

        res.json({ success: true, data: securityMetrics });
    } catch (error) {
        handleError(res, error, 'Security analysis');
    }
};

// =============================================================================
// PERFORMANCE & EFFICIENCY ANALYTICS
// =============================================================================

// --- Certificate generation analysis ---
export const getCertificateAnalysis = async (req, res) => {
    try {
        const { startDate, endDate, ward } = req.query;

        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');
        const wardNumber = ValidationUtils.validateInteger(ward, 'ward number', 0);

        const whereClause = {
            ...(startDateObj ? { issuedAt: { gte: startDateObj } } : {}),
            ...(endDateObj ? { issuedAt: { lte: endDateObj } } : {})
        };

        const certificates = await prisma.certificate.findMany({
            where: whereClause
        });

        // Get child info for ward filtering
        const childIds = certificates.map(c => c.childId);
        const children = await prisma.child.findMany({
            where: {
                id: { in: childIds },
                ...(wardNumber ? { wardNumber } : {})
            },
            select: { id: true, wardNumber: true, fullName: true }
        });

        const childMap = Object.fromEntries(children.map(c => [c.id, c]));

        // Filter certificates by ward if specified
        const filteredCertificates = wardNumber ?
            certificates.filter(cert => childMap[cert.childId]) :
            certificates;

        const analysis = {
            totalCertificates: filteredCertificates.length,
            certificatesWithPDF: filteredCertificates.filter(c => c.pdfPath).length,
            dailyGeneration: {},
            byWard: {},
            issuedByUser: {},
            averagePerDay: 0
        };

        // Analyze patterns
        filteredCertificates.forEach(cert => {
            // Daily generation
            const dateKey = cert.issuedAt.toISOString().split('T')[0];
            analysis.dailyGeneration[dateKey] = (analysis.dailyGeneration[dateKey] || 0) + 1;

            // By ward
            const child = childMap[cert.childId];
            if (child) {
                analysis.byWard[child.wardNumber] = (analysis.byWard[child.wardNumber] || 0) + 1;
            }

            // By issuer
            analysis.issuedByUser[cert.issuedById] = (analysis.issuedByUser[cert.issuedById] || 0) + 1;
        });

        // Calculate averages and format data
        const days = Object.keys(analysis.dailyGeneration).length;
        analysis.averagePerDay = days > 0 ? (filteredCertificates.length / days).toFixed(2) : '0';

        analysis.dailyGeneration = Object.entries(analysis.dailyGeneration)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        analysis.byWard = Object.entries(analysis.byWard)
            .map(([ward, count]) => ({ ward: parseInt(ward), count }))
            .sort((a, b) => b.count - a.count);

        // Get user names for issuers
        const userIds = Object.keys(analysis.issuedByUser).map(id => parseInt(id));
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true, role: true }
        });
        const userMap = Object.fromEntries(users.map(u => [u.id, u]));

        analysis.issuedByUser = Object.entries(analysis.issuedByUser)
            .map(([userId, count]) => ({
                userId: parseInt(userId),
                userName: userMap[parseInt(userId)]?.name || 'Unknown',
                userRole: userMap[parseInt(userId)]?.role || 'Unknown',
                count
            }))
            .sort((a, b) => b.count - a.count);

        res.json({ success: true, data: analysis });
    } catch (error) {
        handleError(res, error, 'Certificate analysis');
    }
};

// --- Correction request analysis ---
export const getCorrectionAnalysis = async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query;

        const startDateObj = ValidationUtils.validateDate(startDate, 'start date');
        const endDateObj = ValidationUtils.validateDate(endDate, 'end date');
        const sanitizedStatus = ValidationUtils.validateString(status, 'status');

        const whereClause = {
            ...(startDateObj ? { createdAt: { gte: startDateObj } } : {}),
            ...(endDateObj ? { createdAt: { lte: endDateObj } } : {}),
            ...(sanitizedStatus ? { status: sanitizedStatus } : {})
        };

        const corrections = await prisma.correctionRequest.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });

        const analysis = {
            totalRequests: corrections.length,
            byStatus: {
                pending: corrections.filter(c => c.status === 'pending').length,
                approved: corrections.filter(c => c.status === 'approved').length,
                rejected: corrections.filter(c => c.status === 'rejected').length
            },
            avgProcessingTime: 0,
            reasonBreakdown: {},
            requestsByUser: {},
            processedByUser: {},
            recentRequests: []
        };

        // Process each correction request
        const processedRequests = corrections.filter(c => c.processedAt);
        if (processedRequests.length > 0) {
            const totalProcessingTime = processedRequests.reduce((sum, req) => {
                const processingTime = new Date(req.processedAt) - new Date(req.createdAt);
                return sum + processingTime;
            }, 0);
            analysis.avgProcessingTime = Math.floor(totalProcessingTime / (processedRequests.length * 1000 * 60 * 60 * 24)); // Days
        }

        corrections.forEach(correction => {
            // Reason breakdown
            analysis.reasonBreakdown[correction.reason] =
                (analysis.reasonBreakdown[correction.reason] || 0) + 1;

            // Requests by user
            analysis.requestsByUser[correction.requestedById] =
                (analysis.requestsByUser[correction.requestedById] || 0) + 1;

            // Processed by user
            if (correction.processedById) {
                analysis.processedByUser[correction.processedById] =
                    (analysis.processedByUser[correction.processedById] || 0) + 1;
            }
        });

        // Get user names
        const allUserIds = [
            ...Object.keys(analysis.requestsByUser).map(id => parseInt(id)),
            ...Object.keys(analysis.processedByUser).map(id => parseInt(id))
        ];
        const users = await prisma.user.findMany({
            where: { id: { in: allUserIds } },
            select: { id: true, name: true, role: true }
        });
        const userMap = Object.fromEntries(users.map(u => [u.id, u]));

        // Format user data
        analysis.requestsByUser = Object.entries(analysis.requestsByUser)
            .map(([userId, count]) => ({
                userId: parseInt(userId),
                userName: userMap[parseInt(userId)]?.name || 'Unknown',
                userRole: userMap[parseInt(userId)]?.role || 'Unknown',
                requestCount: count
            }))
            .sort((a, b) => b.requestCount - a.requestCount);

        analysis.processedByUser = Object.entries(analysis.processedByUser)
            .map(([userId, count]) => ({
                userId: parseInt(userId),
                userName: userMap[parseInt(userId)]?.name || 'Unknown',
                userRole: userMap[parseInt(userId)]?.role || 'Unknown',
                processedCount: count
            }))
            .sort((a, b) => b.processedCount - a.processedCount);

        // Recent requests
        analysis.recentRequests = corrections.slice(0, 20).map(req => ({
            id: req.id,
            vaccinationId: req.vaccinationId,
            reason: req.reason,
            status: req.status,
            requestedBy: userMap[req.requestedById]?.name || 'Unknown',
            processedBy: req.processedById ? (userMap[req.processedById]?.name || 'Unknown') : null,
            createdAt: req.createdAt,
            processedAt: req.processedAt
        }));

        // Format reason breakdown
        analysis.reasonBreakdown = Object.entries(analysis.reasonBreakdown)
            .map(([reason, count]) => ({ reason, count }))
            .sort((a, b) => b.count - a.count);

        res.json({ success: true, data: analysis });
    } catch (error) {
        handleError(res, error, 'Correction analysis');
    }
};