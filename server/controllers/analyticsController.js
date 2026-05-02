import { prisma } from '../utils/prisma.js';
import { cachedAnalytics, clearCache, getFactsStatus } from '../utils/analyticsCache.js';
import { format, startOfWeek, startOfMonth, eachDayOfInterval, parseISO, subMonths } from 'date-fns';

/* ========================================================================== */
/* UTILITY FUNCTIONS */
/* ========================================================================== */

/**
 * Parse date string or return default
 */
function parseDateOrDefault(d, def) {
    try {
        return d ? new Date(d) : def;
    } catch {
        return def;
    }
}

/**
 * Build Prisma where filters from query params
 */
function buildWhereFilters({ ward, casteCode, gender, ageGroup, startDate, endDate }) {
    const where = {};
    if (ward) where.ward = Number(ward);
    if (casteCode) where.casteCode = Number(casteCode);
    if (gender && gender !== 'ALL') where.gender = gender;
    if (ageGroup && ageGroup !== 'ALL') where.ageGroup = ageGroup;

    const start = parseDateOrDefault(startDate, new Date('2020-01-01'));
    const end = parseDateOrDefault(endDate, new Date());
    end.setHours(23, 59, 59, 999);
    where.day = { gte: start, lte: end };
    return where;
}

/**
 * Get today's delta for child vaccinations (real-time data not yet in facts)
 */
async function getTodayChildDelta(ward, casteCode, gender, ageGroup) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const meta = await getFactsStatus();

    // FIX: If no analytics meta exists or lastProcessedChild is null/epoch, return 0
    if (!meta?.lastProcessedChild || new Date(meta.lastProcessedChild).getTime() === 0) {
        return 0;
    }

    if (new Date(meta.lastProcessedChild) >= today) return 0;

    const childFilter = {};
    if (ward) childFilter.wardNumber = Number(ward);
    if (casteCode) childFilter.casteCode = Number(casteCode);
    if (gender && gender !== 'ALL') childFilter.gender = gender;
    if (ageGroup && ageGroup !== 'ALL') {
        const now = new Date();
        if (ageGroup === '0-1y') childFilter.birthDate = { gte: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()) };
        else if (ageGroup === '1-5y') childFilter.birthDate = { gte: new Date(now.getFullYear() - 5, now.getMonth(), now.getDate()) };
    }

    return prisma.vaccinationRecord.count({
        where: {
            dateGiven: { gte: today },
            isComplete: true,
            child: childFilter,
        },
    });
}

/**
 * Aggregate by time granularity (day, week, month)
 */
function aggregateByGranularity(data, granularity, startDate, endDate) {
    if (granularity === 'day') return data;

    const grouped = {};
    data.forEach(item => {
        let key;
        const date = parseISO(item.day);

        if (granularity === 'week') {
            key = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        } else if (granularity === 'month') {
            key = format(startOfMonth(date), 'yyyy-MM-dd');
        }

        if (!grouped[key]) {
            grouped[key] = { day: key, count: 0, sum: {} };
        }

        // Aggregate numeric fields
        Object.keys(item).forEach(field => {
            if (field !== 'day' && typeof item[field] === 'number') {
                grouped[key].sum[field] = (grouped[key].sum[field] || 0) + item[field];
            }
        });
        grouped[key].count++;
    });

    return Object.values(grouped).map(g => ({
        day: g.day,
        ...Object.keys(g.sum).reduce((acc, key) => {
            acc[key] = key.includes('Rate') || key.includes('Pct')
                ? g.sum[key] / g.count
                : g.sum[key];
            return acc;
        }, {})
    }));
}

/**
 * Fill missing dates in time series with zeros
 */
function fillMissingDates(data, startDate, endDate, granularity = 'day') {
    const start = parseDateOrDefault(startDate, new Date('2020-01-01'));
    const end = parseDateOrDefault(endDate, new Date());

    const allDays = eachDayOfInterval({ start, end });
    const dataMap = new Map(data.map(d => [d.day, d]));

    return allDays.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return dataMap.get(dateStr) || { day: dateStr, ...getZeroDefaults() };
    });
}

function getZeroDefaults() {
    return {
        coveragePct: 0,
        vaccinated: 0,
        total: 0,
        dropoutRate: 0,
        onTime: 0,
        late: 0,
        timelinessRate: 0,
        avgWeightKg: 0,
        underweightRate: 0
    };
}

/**
 * Convert array to CSV string
 */
function arrayToCSV(data, headers) {
    if (!data || data.length === 0) return headers.join(',') + '\n';

    const csvRows = [headers.join(',')];
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',')
                ? `"${value}"`
                : value ?? '';
        });
        csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
}

/* ========================================================================== */
/* EXISTING ENDPOINTS (KEPT AS-IS) */
/* ========================================================================== */

export const getSystemOverview = async (req, res) => {
    const {
        ward, casteCode, gender, ageGroup,
        startDate = format(new Date(Date.now() - 30 * 864e5), 'yyyy-MM-dd'),
        endDate = format(new Date(), 'yyyy-MM-dd'),
    } = req.query;

    const cacheKey = `overview:${ward}:${casteCode}:${gender}:${ageGroup}:${startDate}:${endDate}`;

    try {
        const data = await cachedAnalytics(cacheKey, async () => {
            // ✅ FIXED: Only use vaccineTypeId = 0 for overview totals
            const overviewWhere = {
                day: new Date(endDate),
                vaccineTypeId: 0,  // ← CRITICAL: Only summary rows
                doseNumber: 0
            };

            // Apply filters
            if (ward) overviewWhere.ward = Number(ward);
            if (casteCode) overviewWhere.casteCode = Number(casteCode);
            if (gender && gender !== 'ALL') overviewWhere.gender = gender;
            if (ageGroup && ageGroup !== 'ALL') overviewWhere.ageGroup = ageGroup;

            // ✅ FIXED: Get overview from summary rows only
            const childOverview = await prisma.childAnalyticsFact.aggregate({
                _sum: {
                    totalRegisteredChildren: true,
                    vaccinatedChildren: true,
                    zeroDoseChildren: true,
                    dueToday: true,
                    overdue: true,
                    onTime: true,
                    late: true,
                },
                where: overviewWhere,
            });

            // For dropout rates, use the full date range but only non-zero vaccine types
            const dropoutWhere = buildWhereFilters({ ward, casteCode, gender, ageGroup, startDate, endDate });
            dropoutWhere.vaccineTypeId = { not: 0 };

            const dropoutAvg = await prisma.childAnalyticsFact.aggregate({
                _avg: { dropoutRate: true },
                where: dropoutWhere,
            });

            const deltaVacc = await getTodayChildDelta(ward, casteCode, gender, ageGroup);
            const totalVaccinated = (childOverview._sum.vaccinatedChildren || 0) + deltaVacc;
            const totalChildren = childOverview._sum.totalRegisteredChildren || 1;

            // ✅ FIXED: Mother overview - only doseNumber = 0 summary rows
            const motherOverviewWhere = {
                day: new Date(endDate),
                doseNumber: 0  // ← Only summary rows
            };

            if (ward) motherOverviewWhere.ward = Number(ward);
            if (casteCode) motherOverviewWhere.casteCode = Number(casteCode);

            const motherOverview = await prisma.motherAnalyticsFact.aggregate({
                _sum: {
                    totalRegisteredMothers: true,
                    tdDosesGiven: true,
                    mothersWithZeroTD: true,
                    mothersWithFullTD: true,
                    overdue: true,
                },
                where: motherOverviewWhere,
            });

            //  FIXED: Calculate weighted average for mother dropout rate
            const motherDropoutWhere = buildWhereFilters({ ward, casteCode, startDate, endDate });
            motherDropoutWhere.doseNumber = 0;
            motherDropoutWhere.dropoutRate = { not: null }; // Exclude null values

            // Get all mother facts to calculate weighted average
            const motherDropoutData = await prisma.motherAnalyticsFact.findMany({
                where: motherDropoutWhere,
                select: {
                    dropoutRate: true,
                    totalRegisteredMothers: true
                }
            });

            // Calculate weighted average dropout rate
            let totalWeightedDropout = 0;
            let totalMothersForDropout = 0;

            motherDropoutData.forEach(row => {
                if (row.dropoutRate !== null && row.totalRegisteredMothers > 0) {
                    totalWeightedDropout += row.dropoutRate * row.totalRegisteredMothers;
                    totalMothersForDropout += row.totalRegisteredMothers;
                }
            });

            const weightedMotherDropoutRate = totalMothersForDropout > 0
                ? totalWeightedDropout / totalMothersForDropout
                : 0;

            // Growth data can use full range since these are cumulative records
            const growthAgg = await prisma.growthAnalyticsFact.aggregate({
                _sum: {
                    totalWeightRecords: true,
                    underweightCount: true,
                    normalWeightCount: true,
                    overweightCount: true,
                },
                _avg: { avgWeightKg: true },
                where: buildWhereFilters({ ward, casteCode, gender, ageGroup, startDate, endDate }),
            });

            return {
                children: {
                    totalRegistered: childOverview._sum.totalRegisteredChildren || 0,
                    vaccinated: totalVaccinated,
                    zeroDose: childOverview._sum.zeroDoseChildren || 0,
                    coverageRate: (totalVaccinated / totalChildren) * 100,
                    dropoutRate: Number((dropoutAvg._avg.dropoutRate ?? 0)),
                    dueToday: childOverview._sum.dueToday || 0,
                    overdue: childOverview._sum.overdue || 0,
                    onTime: childOverview._sum.onTime || 0,
                    late: childOverview._sum.late || 0,
                },
                mothers: {
                    totalRegistered: motherOverview._sum.totalRegisteredMothers || 0,
                    tdDosesGiven: motherOverview._sum.tdDosesGiven || 0,
                    zeroTD: motherOverview._sum.mothersWithZeroTD || 0,
                    fullTD: motherOverview._sum.mothersWithFullTD || 0,
                    tdCoverage: ((motherOverview._sum.mothersWithFullTD || 0) / (motherOverview._sum.totalRegisteredMothers || 1)) * 100,
                    overdue: motherOverview._sum.overdue || 0,
                    dropoutRate: Number(weightedMotherDropoutRate.toFixed(2)), // ✅ Use weighted average
                },
                nutrition: {
                    totalRecords: growthAgg._sum.totalWeightRecords || 0,
                    avgWeightKg: growthAgg._avg.avgWeightKg || 0,
                    underweightRate: ((growthAgg._sum.underweightCount || 0) / (growthAgg._sum.totalWeightRecords || 1)) * 100,
                    normalRate: ((growthAgg._sum.normalWeightCount || 0) / (growthAgg._sum.totalWeightRecords || 1)) * 100,
                    overweightRate: ((growthAgg._sum.overweightCount || 0) / (growthAgg._sum.totalWeightRecords || 1)) * 100,
                    underweightCount: growthAgg._sum.underweightCount || 0,
                    normalWeightCount: growthAgg._sum.normalWeightCount || 0,
                    overweightCount: growthAgg._sum.overweightCount || 0,
                },
            };
        });

        return res.json({ success: true, data });
    } catch (err) {
        console.error('getSystemOverview error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message || err });
    }
};
/**
 * DEBUG ENDPOINT - Check what's in the analytics facts
 */
export const debugAnalyticsData = async (req, res) => {
    const { ward, casteCode, gender, ageGroup, startDate, endDate } = req.query;

    try {
        console.log('=== DEBUG ANALYTICS DATA ===');

        // Check what aggregate rows exist
        const aggregateRows = await prisma.childAnalyticsFact.findMany({
            where: {
                day: new Date(), // Today
                vaccineTypeId: 0,
                doseNumber: 0,
                gender: 'ALL',
                ageGroup: 'ALL',
                casteCode: 0
            },
            select: {
                ward: true,
                totalRegisteredChildren: true,
                vaccinatedChildren: true
            }
        });

        console.log('Aggregate rows (ALL demographics):', aggregateRows);

        // Check total sum across all demographic combinations
        const totalSum = await prisma.childAnalyticsFact.aggregate({
            _sum: {
                totalRegisteredChildren: true,
                vaccinatedChildren: true
            },
            where: {
                day: new Date(),
                vaccineTypeId: 0,
                doseNumber: 0
            }
        });

        console.log('Total sum across ALL demographic combinations:', totalSum);

        // Check one specific ward in detail
        const wardDetails = await prisma.childAnalyticsFact.findMany({
            where: {
                day: new Date(),
                vaccineTypeId: 0,
                doseNumber: 0,
                ward: 1
            },
            select: {
                ward: true,
                gender: true,
                ageGroup: true,
                casteCode: true,
                totalRegisteredChildren: true,
                vaccinatedChildren: true
            },
            orderBy: [{ gender: 'asc' }, { ageGroup: 'asc' }, { casteCode: 'asc' }]
        });

        console.log('Ward 1 detailed breakdown:', wardDetails);

        res.json({
            success: true,
            data: {
                aggregateRows,
                totalSum,
                wardDetails
            }
        });

    } catch (err) {
        console.error('Debug error:', err);
        res.status(500).json({ success: false, message: 'Debug failed', error: err.message });
    }
};

export const getVaccineCoverage = async (req, res) => {
    const { ward, casteCode, gender, ageGroup, startDate, endDate, groupBy } = req.query;
    const cacheKey = `coverage:${ward}:${casteCode}:${gender}:${ageGroup}:${startDate}:${endDate}:${groupBy}`;

    try {
        const data = await cachedAnalytics(cacheKey, async () => {
            const where = buildWhereFilters({ ward, casteCode, gender, ageGroup, startDate, endDate });

            const byVaccine = await prisma.childAnalyticsFact.groupBy({
                by: ['vaccineTypeId'],
                _sum: { vaccinatedChildren: true, totalRegisteredChildren: true, zeroDoseChildren: true },
                where,
            });

            const mappedVaccine = byVaccine.map(v => ({
                vaccineTypeId: v.vaccineTypeId ?? 0,
                vaccinated: v._sum.vaccinatedChildren || 0,
                total: v._sum.totalRegisteredChildren || 0,
                zeroDose: v._sum.zeroDoseChildren || 0,
                coverage: ((v._sum.vaccinatedChildren || 0) / (v._sum.totalRegisteredChildren || 1)) * 100,
            }));

            let byWard = [];
            if (groupBy === 'ward') {
                byWard = await prisma.childAnalyticsFact.groupBy({
                    by: ['ward'],
                    _sum: { vaccinatedChildren: true, totalRegisteredChildren: true },
                    where,
                });
            }

            return { byVaccine: mappedVaccine, byWard };
        });
        res.json({ success: true, data });
    } catch (err) {
        console.error('getVaccineCoverage error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

export const getDropoutRates = async (req, res) => {
    const { ward, casteCode, gender, ageGroup, startDate, endDate } = req.query;
    try {
        const where = buildWhereFilters({ ward, casteCode, gender, ageGroup, startDate, endDate });
        where.vaccineTypeId = { not: 0 };
        const facts = await prisma.childAnalyticsFact.groupBy({
            by: ['vaccineTypeId'],
            _avg: { dropoutRate: true },
            where,
        });
        const mapped = facts.map(f => ({ vaccineTypeId: f.vaccineTypeId, dropoutRate: f._avg.dropoutRate || 0 }));
        res.json({ success: true, data: mapped });
    } catch (err) {
        console.error('getDropoutRates error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

export const getZeroDoseChildren = async (req, res) => {
    const { ward, casteCode, gender, ageGroup, startDate, endDate } = req.query;
    try {
        //  FIXED: Only use vaccineTypeId = 0 summary rows
        const where = buildWhereFilters({ ward, casteCode, gender, ageGroup, startDate, endDate });
        where.vaccineTypeId = 0;
        where.doseNumber = 0;

        const agg = await prisma.childAnalyticsFact.aggregate({
            _sum: { zeroDoseChildren: true, totalRegisteredChildren: true },
            where,
        });

        const zero = agg._sum.zeroDoseChildren || 0;
        const total = agg._sum.totalRegisteredChildren || 1;
        res.json({ success: true, data: { zeroDoseCount: zero, zeroDoseRate: (zero / total) * 100 } });
    } catch (err) {
        console.error('getZeroDoseChildren error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

export const getGrowthMonitoring = async (req, res) => {
    const { ward, casteCode, gender, ageGroup, startDate, endDate } = req.query;
    try {
        const where = buildWhereFilters({ ward, casteCode, gender, ageGroup, startDate, endDate });
        const agg = await prisma.growthAnalyticsFact.aggregate({
            _sum: { totalWeightRecords: true, underweightCount: true, normalWeightCount: true, overweightCount: true },
            _avg: { avgWeightKg: true },
            where,
        });
        const total = agg._sum.totalWeightRecords || 1;
        res.json({
            success: true,
            data: {
                totalRecords: total,
                avgWeightKg: agg._avg.avgWeightKg || 0,
                underweightRate: ((agg._sum.underweightCount || 0) / total) * 100,
                normalRate: ((agg._sum.normalWeightCount || 0) / total) * 100,
                overweightRate: ((agg._sum.overweightCount || 0) / total) * 100,
            },
        });
    } catch (err) {
        console.error('getGrowthMonitoring error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

export const getTDCoverage = async (req, res) => {
    const { ward, casteCode, startDate, endDate } = req.query;
    try {
        const where = buildWhereFilters({ ward, casteCode, startDate, endDate });
        delete where.gender; delete where.ageGroup;
        const facts = await prisma.motherAnalyticsFact.groupBy({
            by: ['doseNumber'],
            _sum: { tdDosesGiven: true, totalRegisteredMothers: true, mothersWithFullTD: true },
            where,
        });
        const mapped = facts.map(f => ({
            doseNumber: f.doseNumber,
            tdDosesGiven: f._sum.tdDosesGiven || 0,
            totalMothers: f._sum.totalRegisteredMothers || 0,
            coverage: ((f._sum.mothersWithFullTD || 0) / (f._sum.totalRegisteredMothers || 1)) * 100,
        }));
        res.json({ success: true, data: mapped });
    } catch (err) {
        console.error('getTDCoverage error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

export const getDueOverdue = async (req, res) => {
    const { ward, casteCode, gender, ageGroup, startDate, endDate } = req.query;
    try {
        // ✅ FIXED: Only use vaccineTypeId = 0 summary rows
        const where = buildWhereFilters({ ward, casteCode, gender, ageGroup, startDate, endDate });
        where.vaccineTypeId = 0;
        where.doseNumber = 0;  // Also ensure doseNumber = 0 for summaries

        const agg = await prisma.childAnalyticsFact.aggregate({
            _sum: { dueToday: true, overdue: true, onTime: true, late: true },
            where,
        });

        const on = agg._sum.onTime || 0;
        const late = agg._sum.late || 0;
        res.json({
            success: true,
            data: {
                dueToday: agg._sum.dueToday || 0,
                overdue: agg._sum.overdue || 0, // ← Now correct!
                onTime: on,
                late,
                timelinessRate: (on / ((on + late) || 1)) * 100,
            },
        });
    } catch (err) {
        console.error('getDueOverdue error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

/* ========================================================================== */
/* NEW ENDPOINTS */
/* ========================================================================== */

/**
 * GET /api/analytics/trends
 * Returns time-series data for coverage, dropout, timeliness, and nutrition
 */
export const getTrends = async (req, res) => {
    const {
        ward, casteCode, gender, ageGroup,
        startDate, endDate,
        granularity = 'day'
    } = req.query;

    const cacheKey = `trends:${ward}:${casteCode}:${gender}:${ageGroup}:${startDate}:${endDate}:${granularity}`;

    try {
        console.log(`[CACHE] Checking trends cache: ${cacheKey}`);

        const data = await cachedAnalytics(cacheKey, async () => {
            console.log('[CACHE] Cache miss - computing trends');

            const where = buildWhereFilters({ ward, casteCode, gender, ageGroup, startDate, endDate });
            where.vaccineTypeId = 0;
            where.doseNumber = 0;

            // Fetch child facts by day
            const childFacts = await prisma.childAnalyticsFact.findMany({
                where,
                select: {
                    day: true,
                    vaccinatedChildren: true,
                    totalRegisteredChildren: true,
                    dropoutRate: true,
                    onTime: true,
                    late: true,
                },
                orderBy: { day: 'asc' }
            });

            // Fetch growth facts by day
            const growthWhere = buildWhereFilters({ ward, casteCode, gender, ageGroup, startDate, endDate });
            const growthFacts = await prisma.growthAnalyticsFact.findMany({
                where: growthWhere,
                select: {
                    day: true,
                    avgWeightKg: true,
                    underweightCount: true,
                    totalWeightRecords: true,
                },
                orderBy: { day: 'asc' }
            });

            // Map to time series
            const childMap = new Map(childFacts.map(f => [format(f.day, 'yyyy-MM-dd'), f]));
            const growthMap = new Map(growthFacts.map(f => [format(f.day, 'yyyy-MM-dd'), f]));

            // Combine data
            let combinedData = [];
            const start = parseDateOrDefault(startDate, new Date('2020-01-01'));
            const end = parseDateOrDefault(endDate, new Date());
            const allDays = eachDayOfInterval({ start, end });

            allDays.forEach(date => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const child = childMap.get(dateStr);
                const growth = growthMap.get(dateStr);

                const vaccinated = child?.vaccinatedChildren || 0;
                const total = child?.totalRegisteredChildren || 1;
                const onTime = child?.onTime || 0;
                const late = child?.late || 0;
                const underweight = growth?.underweightCount || 0;
                const totalWeight = growth?.totalWeightRecords || 1;

                combinedData.push({
                    day: dateStr,
                    coveragePct: (vaccinated / total) * 100,
                    vaccinated,
                    total,
                    dropoutRate: child?.dropoutRate || 0,
                    onTime,
                    late,
                    timelinessRate: (onTime / ((onTime + late) || 1)) * 100,
                    avgWeightKg: growth?.avgWeightKg || 0,
                    underweightRate: (underweight / totalWeight) * 100
                });
            });

            // Aggregate by granularity
            if (granularity !== 'day') {
                combinedData = aggregateByGranularity(combinedData, granularity, startDate, endDate);
            }

            return {
                days: combinedData.map(d => d.day),
                coverage: combinedData.map(d => ({
                    day: d.day,
                    coveragePct: Number(d.coveragePct.toFixed(2)),
                    vaccinated: d.vaccinated,
                    total: d.total
                })),
                dropout: combinedData.map(d => ({
                    day: d.day,
                    dropoutRate: Number(d.dropoutRate.toFixed(2))
                })),
                timeliness: combinedData.map(d => ({
                    day: d.day,
                    onTime: d.onTime,
                    late: d.late,
                    timelinessRate: Number(d.timelinessRate.toFixed(2))
                })),
                nutrition: combinedData.map(d => ({
                    day: d.day,
                    avgWeightKg: Number(d.avgWeightKg.toFixed(2)),
                    underweightRate: Number(d.underweightRate.toFixed(2))
                }))
            };
        });

        res.json({ success: true, data });
    } catch (err) {
        console.error('getTrends error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

/**
 * GET /api/analytics/ward-performance
 * Returns ward rankings for coverage, overdue, dropout, underweight
 */
export const getWardPerformance = async (req, res) => {
    const {
        startDate, endDate,
        limit = '10',
        sortBy = 'coverage' // coverage, overdue, dropoutRate, underweightRate
    } = req.query;

    const cacheKey = `ward-performance:${startDate}:${endDate}:${limit}:${sortBy}`;

    try {
        console.log(`[CACHE] Checking ward-performance cache: ${cacheKey}`);

        const data = await cachedAnalytics(cacheKey, async () => {
            console.log('[CACHE] Cache miss - computing ward performance');

            const where = buildWhereFilters({ startDate, endDate });
            where.vaccineTypeId = 0;
            where.doseNumber = 0;

            // Child data by ward
            const childByWard = await prisma.childAnalyticsFact.groupBy({
                by: ['ward'],
                _sum: {
                    vaccinatedChildren: true,
                    totalRegisteredChildren: true,
                    overdue: true,
                },
                _avg: { dropoutRate: true },
                where,
            });

            // Growth data by ward
            const growthWhere = buildWhereFilters({ startDate, endDate });
            const growthByWard = await prisma.growthAnalyticsFact.groupBy({
                by: ['ward'],
                _sum: {
                    underweightCount: true,
                    totalWeightRecords: true,
                },
                where: growthWhere,
            });

            const growthMap = new Map(growthByWard.map(g => [
                g.ward,
                {
                    underweightCount: g._sum.underweightCount || 0,
                    totalWeightRecords: g._sum.totalWeightRecords || 0
                }
            ]));

            // Combine and calculate metrics
            let wardData = childByWard.map(w => {
                const growth = growthMap.get(w.ward) || { underweightCount: 0, totalWeightRecords: 1 };
                const vaccinated = w._sum.vaccinatedChildren || 0;
                const total = w._sum.totalRegisteredChildren || 1;

                return {
                    ward: w.ward,
                    coverage: (vaccinated / total) * 100,
                    overdue: w._sum.overdue || 0,
                    dropoutRate: w._avg.dropoutRate || 0,
                    underweightRate: (growth.underweightCount / growth.totalWeightRecords) * 100
                };
            });

            // Sort based on sortBy parameter
            wardData.sort((a, b) => {
                if (sortBy === 'coverage') return b.coverage - a.coverage;
                if (sortBy === 'overdue') return a.overdue - b.overdue;
                if (sortBy === 'dropoutRate') return a.dropoutRate - b.dropoutRate;
                if (sortBy === 'underweightRate') return a.underweightRate - b.underweightRate;
                return 0;
            });

            // Limit results
            wardData = wardData.slice(0, parseInt(limit));

            return wardData.map(w => ({
                ward: w.ward,
                coverage: Number(w.coverage.toFixed(2)),
                overdue: w.overdue,
                dropoutRate: Number(w.dropoutRate.toFixed(2)),
                underweightRate: Number(w.underweightRate.toFixed(2))
            }));
        });

        res.json({ success: true, data });
    } catch (err) {
        console.error('getWardPerformance error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

/**
 * GET /api/analytics/disparities
 * Returns coverage and nutrition breakdown by gender or caste
 */
export const getDisparities = async (req, res) => {
    const {
        startDate, endDate,
        breakdown = 'gender' // gender or casteCode
    } = req.query;

    const cacheKey = `disparities:${startDate}:${endDate}:${breakdown}`;

    try {
        const data = await cachedAnalytics(cacheKey, async () => {
            const where = buildWhereFilters({ startDate, endDate });
            where.vaccineTypeId = 0;
            where.doseNumber = 0;

            const groupByField = breakdown === 'gender' ? 'gender' : 'casteCode';

            // Child data by breakdown
            const childByGroup = await prisma.childAnalyticsFact.groupBy({
                by: [groupByField],
                _sum: {
                    vaccinatedChildren: true,
                    totalRegisteredChildren: true,
                    zeroDoseChildren: true,
                },
                _avg: { dropoutRate: true },
                where,
            });

            // Growth data by breakdown
            const growthWhere = buildWhereFilters({ startDate, endDate });
            const growthByGroup = await prisma.growthAnalyticsFact.groupBy({
                by: [groupByField],
                _sum: {
                    underweightCount: true,
                    normalWeightCount: true,
                    overweightCount: true,
                    totalWeightRecords: true,
                },
                where: growthWhere,
            });

            const growthMap = new Map(growthByGroup.map(g => [
                g[groupByField],
                {
                    underweightCount: g._sum.underweightCount || 0,
                    normalWeightCount: g._sum.normalWeightCount || 0,
                    overweightCount: g._sum.overweightCount || 0,
                    totalWeightRecords: g._sum.totalWeightRecords || 0
                }
            ]));

            return childByGroup
                .filter(g => g[groupByField]) // Exclude null groups
                .map(g => {
                    const growth = growthMap.get(g[groupByField]) || {
                        underweightCount: 0,
                        normalWeightCount: 0,
                        overweightCount: 0,
                        totalWeightRecords: 1
                    };
                    const vaccinated = g._sum.vaccinatedChildren || 0;
                    const total = g._sum.totalRegisteredChildren || 1;

                    return {
                        group: g[groupByField],
                        coverage: Number(((vaccinated / total) * 100).toFixed(2)),
                        dropoutRate: Number((g._avg.dropoutRate || 0).toFixed(2)),
                        zeroDose: g._sum.zeroDoseChildren || 0,
                        underweightRate: Number(((growth.underweightCount / growth.totalWeightRecords) * 100).toFixed(2)),
                        normalRate: Number(((growth.normalWeightCount / growth.totalWeightRecords) * 100).toFixed(2)),
                        overweightRate: Number(((growth.overweightCount / growth.totalWeightRecords) * 100).toFixed(2)),
                        totalChildren: total,
                        vaccinatedChildren: vaccinated
                    };
                });
        });

        res.json({ success: true, data });
    } catch (err) {
        console.error('getDisparities error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

/**
 * GET /api/analytics/comparison
 * Compare two date ranges for key KPIs
 */
export const getComparison = async (req, res) => {
    const {
        startDate, endDate,
        compareStartDate, compareEndDate,
        ward, casteCode, gender, ageGroup
    } = req.query;

    if (!compareStartDate || !compareEndDate) {
        return res.status(400).json({
            success: false,
            message: 'compareStartDate and compareEndDate are required'
        });
    }

    const cacheKey = `comparison:${startDate}:${endDate}:${compareStartDate}:${compareEndDate}:${ward}:${casteCode}:${gender}:${ageGroup}`;

    try {
        const data = await cachedAnalytics(cacheKey, async () => {
            // Current period
            const currentWhere = buildWhereFilters({ ward, casteCode, gender, ageGroup, startDate, endDate });
            currentWhere.vaccineTypeId = 0;
            currentWhere.doseNumber = 0;

            const currentChild = await prisma.childAnalyticsFact.aggregate({
                _sum: {
                    vaccinatedChildren: true,
                    totalRegisteredChildren: true,
                    zeroDoseChildren: true,
                    overdue: true,
                    onTime: true,
                    late: true,
                },
                _avg: { dropoutRate: true },
                where: currentWhere,
            });

            const currentGrowthWhere = buildWhereFilters({ ward, casteCode, gender, ageGroup, startDate, endDate });
            const currentGrowth = await prisma.growthAnalyticsFact.aggregate({
                _sum: {
                    underweightCount: true,
                    totalWeightRecords: true,
                },
                _avg: { avgWeightKg: true },
                where: currentGrowthWhere,
            });

            // Previous period
            const previousWhere = buildWhereFilters({
                ward, casteCode, gender, ageGroup,
                startDate: compareStartDate,
                endDate: compareEndDate
            });
            previousWhere.vaccineTypeId = 0;
            previousWhere.doseNumber = 0;

            const previousChild = await prisma.childAnalyticsFact.aggregate({
                _sum: {
                    vaccinatedChildren: true,
                    totalRegisteredChildren: true,
                    zeroDoseChildren: true,
                    overdue: true,
                    onTime: true,
                    late: true,
                },
                _avg: { dropoutRate: true },
                where: previousWhere,
            });

            const previousGrowthWhere = buildWhereFilters({
                ward, casteCode, gender, ageGroup,
                startDate: compareStartDate,
                endDate: compareEndDate
            });
            const previousGrowth = await prisma.growthAnalyticsFact.aggregate({
                _sum: {
                    underweightCount: true,
                    totalWeightRecords: true,
                },
                _avg: { avgWeightKg: true },
                where: previousGrowthWhere,
            });

            // Calculate metrics
            const calcMetric = (curr, prev) => {
                const changePct = prev !== 0 ? ((curr - prev) / prev) * 100 : 0;
                return {
                    current: Number(curr.toFixed(2)),
                    previous: Number(prev.toFixed(2)),
                    changePct: Number(changePct.toFixed(2))
                };
            };

            const currentCoverage = (currentChild._sum.vaccinatedChildren || 0) / (currentChild._sum.totalRegisteredChildren || 1) * 100;
            const previousCoverage = (previousChild._sum.vaccinatedChildren || 0) / (previousChild._sum.totalRegisteredChildren || 1) * 100;

            const currentTimeliness = (currentChild._sum.onTime || 0) / ((currentChild._sum.onTime + currentChild._sum.late) || 1) * 100;
            const previousTimeliness = (previousChild._sum.onTime || 0) / ((previousChild._sum.onTime + previousChild._sum.late) || 1) * 100;

            const currentUnderweight = (currentGrowth._sum.underweightCount || 0) / (currentGrowth._sum.totalWeightRecords || 1) * 100;
            const previousUnderweight = (previousGrowth._sum.underweightCount || 0) / (previousGrowth._sum.totalWeightRecords || 1) * 100;

            return {
                coverage: calcMetric(currentCoverage, previousCoverage),
                dropoutRate: calcMetric(currentChild._avg.dropoutRate || 0, previousChild._avg.dropoutRate || 0),
                zeroDose: calcMetric(currentChild._sum.zeroDoseChildren || 0, previousChild._sum.zeroDoseChildren || 0),
                overdue: calcMetric(currentChild._sum.overdue || 0, previousChild._sum.overdue || 0),
                timeliness: calcMetric(currentTimeliness, previousTimeliness),
                underweightRate: calcMetric(currentUnderweight, previousUnderweight),
                avgWeight: calcMetric(currentGrowth._avg.avgWeightKg || 0, previousGrowth._avg.avgWeightKg || 0)
            };
        });

        res.json({ success: true, data });
    } catch (err) {
        console.error('getComparison error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

/**
 * GET /api/analytics/export
 * Export analytics data as CSV
 */
export const exportAnalytics = async (req, res) => {
    const { type, ...filters } = req.query;

    try {
        let data = [];
        let headers = [];
        let filename = 'analytics-export.csv';

        switch (type) {
            case 'overview': {
                const overviewReq = { query: filters };
                const overviewRes = {
                    json: (result) => { data = [result.data]; }
                };
                await getSystemOverview(overviewReq, overviewRes);

                headers = ['metric', 'children', 'mothers', 'nutrition'];
                data = [
                    { metric: 'Total Registered', children: data[0]?.children?.totalRegistered, mothers: data[0]?.mothers?.totalRegistered, nutrition: data[0]?.nutrition?.totalRecords },
                    { metric: 'Vaccinated/TD', children: data[0]?.children?.vaccinated, mothers: data[0]?.mothers?.tdDosesGiven, nutrition: '-' },
                    { metric: 'Coverage %', children: data[0]?.children?.coverageRate?.toFixed(2), mothers: data[0]?.mothers?.tdCoverage?.toFixed(2), nutrition: '-' },
                    { metric: 'Dropout %', children: data[0]?.children?.dropoutRate?.toFixed(2), mothers: '-', nutrition: '-' },
                    { metric: 'Overdue', children: data[0]?.children?.overdue, mothers: data[0]?.mothers?.overdue, nutrition: '-' },
                ];
                filename = 'overview-export.csv';
                break;
            }

            case 'coverage': {
                const coverageReq = { query: filters };
                const coverageRes = {
                    json: (result) => { data = result.data.byVaccine; }
                };
                await getVaccineCoverage(coverageReq, coverageRes);

                headers = ['vaccineTypeId', 'vaccinated', 'total', 'zeroDose', 'coverage'];
                filename = 'coverage-export.csv';
                break;
            }

            case 'trends': {
                const trendsReq = { query: filters };
                const trendsRes = {
                    json: (result) => {
                        const trends = result.data;
                        data = trends.days.map((day, i) => ({
                            day,
                            coveragePct: trends.coverage[i]?.coveragePct,
                            vaccinated: trends.coverage[i]?.vaccinated,
                            total: trends.coverage[i]?.total,
                            dropoutRate: trends.dropout[i]?.dropoutRate,
                            timelinessRate: trends.timeliness[i]?.timelinessRate,
                            avgWeightKg: trends.nutrition[i]?.avgWeightKg,
                            underweightRate: trends.nutrition[i]?.underweightRate
                        }));
                    }
                };
                await getTrends(trendsReq, trendsRes);

                headers = ['day', 'coveragePct', 'vaccinated', 'total', 'dropoutRate', 'timelinessRate', 'avgWeightKg', 'underweightRate'];
                filename = 'trends-export.csv';
                break;
            }

            case 'ward-performance': {
                const wardReq = { query: filters };
                const wardRes = {
                    json: (result) => { data = result.data; }
                };
                await getWardPerformance(wardReq, wardRes);

                headers = ['ward', 'coverage', 'overdue', 'dropoutRate', 'underweightRate'];
                filename = 'ward-performance-export.csv';
                break;
            }

            case 'disparities': {
                const dispReq = { query: filters };
                const dispRes = {
                    json: (result) => { data = result.data; }
                };
                await getDisparities(dispReq, dispRes);

                headers = ['group', 'coverage', 'dropoutRate', 'zeroDose', 'underweightRate', 'totalChildren', 'vaccinatedChildren'];
                filename = 'disparities-export.csv';
                break;
            }

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid export type. Valid types: overview, coverage, trends, ward-performance, disparities'
                });
        }

        const csv = arrayToCSV(data, headers);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    } catch (err) {
        console.error('exportAnalytics error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

/**
 * GET /api/analytics/status (Enhanced)
 * Returns processing status and data health metrics
 */
export const getFactsStatusController = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const meta = await getFactsStatus();

        // Count processed rows in date range
        let counts = { childFacts: 0, motherFacts: 0, growthFacts: 0 };

        if (startDate && endDate) {
            const where = buildWhereFilters({ startDate, endDate });

            const [childCount, motherCount, growthCount] = await Promise.all([
                prisma.childAnalyticsFact.count({ where }),
                prisma.motherAnalyticsFact.count({ where }),
                prisma.growthAnalyticsFact.count({ where })
            ]);

            counts = {
                childFacts: childCount,
                motherFacts: motherCount,
                growthFacts: growthCount
            };
        }

        res.json({
            success: true,
            data: {
                lastProcessedChild: meta?.lastProcessedChild,
                lastProcessedMother: meta?.lastProcessedMother,
                lastProcessedGrowth: meta?.lastProcessedGrowth,
                counts
            }
        });
    } catch (err) {
        console.error('getFactsStatusController error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }

};
/**
 * GET /api/analytics/monthly-dropout
 * Fetch monthly dropout rates, grouped by specified field (vaccine, ward, etc.)
 */
export const getMonthlyDropout = async (req, res) => {
    const {
        ward, casteCode, gender, ageGroup, vaccineTypeId,
        startDate, endDate,
        monthRange = '12',
        dropoutGroup = 'vaccine'  // vaccine, ward, gender, ageGroup, caste
    } = req.query;

    const groupBy = dropoutGroup;
    const monthsBack = parseInt(monthRange, 10) || 12;
    const cacheKey = `monthly-dropout:${ward}:${casteCode}:${gender}:${ageGroup}:${vaccineTypeId}:${startDate || ''}:${endDate || ''}:${monthRange}:${groupBy}`;

    try {
        const data = await cachedAnalytics(cacheKey, async () => {
            // Use monthRange to determine the date range for snapshots
            const gteDate = subMonths(new Date(), monthsBack);
            const lteDate = new Date();

            const where = {
                snapshotMonth: {
                    gte: gteDate,
                    lte: lteDate
                }
            };

            if (ward && ward !== '' && ward !== 'ALL') where.ward = Number(ward);
            if (casteCode && casteCode !== '' && casteCode !== 'ALL') where.casteCode = Number(casteCode);
            if (gender && gender !== '' && gender !== 'ALL') where.gender = gender;
            if (ageGroup && ageGroup !== '' && ageGroup !== 'ALL') where.ageGroup = ageGroup;
            if (vaccineTypeId && vaccineTypeId !== '' && vaccineTypeId !== 'ALL') where.vaccineTypeId = Number(vaccineTypeId);

            // Fetch raw data - order only by snapshotMonth to avoid field path issues
            const rawData = await prisma.childMonthlyDropoutFact.findMany({
                where,
                select: {
                    snapshotMonth: true,
                    ward: true,
                    vaccineTypeId: true,
                    gender: true,
                    ageGroup: true,
                    casteCode: true,
                    dropoutRate: true,
                    totalDue: true,
                    totalCompleted: true,
                    dropoutCount: true
                },
                orderBy: [
                    { snapshotMonth: 'asc' }
                ]
            });

            if (rawData.length === 0) return [];

            // Return with formatted snapshotMonth as string for easier frontend handling
            return rawData.map(row => ({
                snapshotMonth: format(row.snapshotMonth, 'yyyy-MM'),  // Format as '2025-11' string
                ward: row.ward,
                vaccineTypeId: row.vaccineTypeId,
                gender: row.gender || 'ALL',
                ageGroup: row.ageGroup || 'ALL',
                casteCode: row.casteCode || 0,
                dropoutRate: Number(row.dropoutRate || 0),
                totalDue: row.totalDue,
                totalCompleted: row.totalCompleted,
                dropoutCount: row.dropoutCount
            }));
        });

        res.json({ success: true, data });
    } catch (err) {
        console.error('getMonthlyDropout error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};
// analyticsController.js - Add this new endpoint

/**
 * GET /api/analytics/rolling-dropout
 * Returns rolling dropout data (1M, 3M, 6M, 12M)
 */
export const getRollingDropout = async (req, res) => {
    const {
        ward, casteCode, gender, ageGroup, vaccineTypeId,
        startDate, endDate,
        windowType = '1M', // 1M, 3M, 6M, 12M
        groupBy = 'vaccine' // vaccine, ward, gender, ageGroup, caste
    } = req.query;

    const cacheKey = `rolling-dropout:${ward}:${casteCode}:${gender}:${ageGroup}:${vaccineTypeId}:${startDate}:${endDate}:${windowType}:${groupBy}`;

    try {
        const data = await cachedAnalytics(cacheKey, async () => {
            const where = {
                windowType: windowType
            };

            // Date range filtering
            if (startDate && endDate) {
                where.snapshotMonth = {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                };
            }

            // Demographic filtering
            if (ward && ward !== '' && ward !== 'ALL') where.ward = Number(ward);
            if (casteCode && casteCode !== '' && casteCode !== 'ALL') where.casteCode = Number(casteCode);
            if (gender && gender !== '' && gender !== 'ALL') where.gender = gender;
            if (ageGroup && ageGroup !== '' && ageGroup !== 'ALL') where.ageGroup = ageGroup;
            if (vaccineTypeId && vaccineTypeId !== '' && vaccineTypeId !== 'ALL') where.vaccineTypeId = Number(vaccineTypeId);

            // Fetch rolling dropout data
            const rollingData = await prisma.childRollingDropoutFact.findMany({
                where,
                select: {
                    snapshotMonth: true,
                    windowType: true,
                    ward: true,
                    vaccineTypeId: true,
                    gender: true,
                    ageGroup: true,
                    casteCode: true,
                    totalDue: true,
                    totalCompleted: true,
                    dropoutCount: true,
                    dropoutRate: true
                },
                orderBy: [
                    { snapshotMonth: 'asc' },
                    { ward: 'asc' }
                ]
            });

            // Format and group data
            return rollingData.map(row => ({
                snapshotMonth: format(row.snapshotMonth, 'yyyy-MM'),
                windowType: row.windowType,
                ward: row.ward,
                vaccineTypeId: row.vaccineTypeId,
                gender: row.gender || 'ALL',
                ageGroup: row.ageGroup || 'ALL',
                casteCode: row.casteCode || 0,
                totalDue: row.totalDue,
                totalCompleted: row.totalCompleted,
                dropoutCount: row.dropoutCount,
                dropoutRate: Number(row.dropoutRate || 0)
            }));
        });

        res.json({ success: true, data });
    } catch (err) {
        console.error('getRollingDropout error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};
/* ========================================================================== */
/* INVENTORY ENDPOINTS */
/* ========================================================================== */

/**
 * GET /api/analytics/inventory
 * Get monthly inventory and dose data
 */
export const getMonthlyInventory = async (req, res) => {
    const { snapshotMonth } = req.query;

    try {
        // Parse the month date - ensure it's the first day of the month
        const monthDate = snapshotMonth ? new Date(snapshotMonth) : new Date();
        monthDate.setDate(1);
        monthDate.setHours(0, 0, 0, 0);

        const [vaccineTypes, doseCounts, inventories, special] = await Promise.all([
            prisma.vaccineType.findMany({
                select: { id: true, name: true },
                where: { isActive: true }
            }),
            prisma.monthlyDoseCount.findMany({
                where: { snapshotMonth: monthDate },
                include: { vaccineType: true }
            }),
            prisma.monthlyVaccineInventory.findMany({
                where: { snapshotMonth: monthDate },
                include: { vaccineType: true }
            }),
            prisma.monthlySpecialFact.findFirst({
                where: { snapshotMonth: monthDate }
            })
        ]);

        res.json({
            success: true,
            data: {
                vaccineTypes,
                doseCounts,
                inventories,
                special: special || {
                    fullWithin23m: 0,
                    started24To59m: 0,
                    aefiNormal: 0,
                    aefiSerious: 0
                }
            }
        });
    } catch (err) {
        console.error('getMonthlyInventory error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

/**
 * POST /api/analytics/inventory
 * Save monthly inventory data
 */
export const saveMonthlyInventory = async (req, res) => {
    const { snapshotMonth, doseCounts, inventories, special } = req.body;

    try {
        // Validate required fields
        if (!snapshotMonth) {
            return res.status(400).json({
                success: false,
                message: 'snapshotMonth is required'
            });
        }

        const monthDate = new Date(snapshotMonth);
        monthDate.setDate(1);
        monthDate.setHours(0, 0, 0, 0);

        await prisma.$transaction(async (tx) => {
            // Delete existing data for this month
            await tx.monthlyDoseCount.deleteMany({
                where: { snapshotMonth: monthDate }
            });
            await tx.monthlyVaccineInventory.deleteMany({
                where: { snapshotMonth: monthDate }
            });
            await tx.monthlySpecialFact.deleteMany({
                where: { snapshotMonth: monthDate }
            });

            // Insert new dose counts
            if (doseCounts && Array.isArray(doseCounts)) {
                for (const dc of doseCounts) {
                    if (dc.vaccineTypeId && dc.doseNumber !== undefined) {
                        await tx.monthlyDoseCount.create({
                            data: {
                                snapshotMonth: monthDate,
                                vaccineTypeId: dc.vaccineTypeId,
                                doseNumber: dc.doseNumber,
                                countGiven: dc.countGiven || 0
                            }
                        });
                    }
                }
            }

            // Insert new inventory data
            if (inventories && Array.isArray(inventories)) {
                for (const inv of inventories) {
                    if (inv.vaccineTypeId) {
                        await tx.monthlyVaccineInventory.create({
                            data: {
                                snapshotMonth: monthDate,
                                vaccineTypeId: inv.vaccineTypeId,
                                received: inv.received || 0,
                                spent: inv.spent || 0,
                                opened: inv.opened || 0,
                                spoiled: inv.spoiled || 0,
                                returned: inv.returned || 0
                            }
                        });
                    }
                }
            }

            // Insert special counts
            if (special) {
                await tx.monthlySpecialFact.create({
                    data: {
                        snapshotMonth: monthDate,
                        fullWithin23m: special.fullWithin23m || 0,
                        started24To59m: special.started24To59m || 0,
                        aefiNormal: special.aefiNormal || 0,
                        aefiSerious: special.aefiSerious || 0
                    }
                });
            }
        }, { timeout: 10000 });

        res.json({
            success: true,
            message: 'Monthly inventory data saved successfully'
        });
    } catch (err) {
        console.error('saveMonthlyInventory error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to save inventory data',
            error: err.message
        });
    }
};

/**
 * GET /api/analytics/inventory/history
 * Get inventory history for multiple months
 */
export const getInventoryHistory = async (req, res) => {
    const { startMonth, endMonth, vaccineTypeId } = req.query;

    try {
        const startDate = startMonth ? new Date(startMonth) : subMonths(new Date(), 12);
        const endDate = endMonth ? new Date(endMonth) : new Date();

        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(1);
        endDate.setHours(0, 0, 0, 0);

        const where = {
            snapshotMonth: {
                gte: startDate,
                lte: endDate
            }
        };

        if (vaccineTypeId) {
            where.vaccineTypeId = Number(vaccineTypeId);
        }

        const [doseCounts, inventories, specialFacts] = await Promise.all([
            prisma.monthlyDoseCount.findMany({
                where,
                include: { vaccineType: true },
                orderBy: { snapshotMonth: 'asc' }
            }),
            prisma.monthlyVaccineInventory.findMany({
                where,
                include: { vaccineType: true },
                orderBy: { snapshotMonth: 'asc' }
            }),
            prisma.monthlySpecialFact.findMany({
                where: {
                    snapshotMonth: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                orderBy: { snapshotMonth: 'asc' }
            })
        ]);

        res.json({
            success: true,
            data: {
                doseCounts,
                inventories,
                specialFacts
            }
        });
    } catch (err) {
        console.error('getInventoryHistory error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
};

/**
 * GET /api/analytics/inventory/auto-fill
 * Auto-fill inventory data for the current month from live data
 */
/**
 * GET /api/analytics/inventory/auto-fill
 * Auto-fill inventory data for the current month from live data
 */
/**
 * GET /api/analytics/inventory/auto-fill
 * Auto-fill inventory data for the current month from live data
 */
/**
 * GET /api/analytics/inventory/auto-fill
 * Auto-fill inventory data from VaccinationRecord table for the selected month
 */
/**
 * GET /api/analytics/inventory/auto-fill
 * Auto-fill inventory data from VaccinationRecord table for the selected month
 */
export const autoFillInventory = async (req, res) => {
    const { snapshotMonth } = req.query;

    try {
        // Parse the target month
        const targetMonth = snapshotMonth ? new Date(snapshotMonth) : new Date();
        targetMonth.setDate(1);
        targetMonth.setHours(0, 0, 0, 0);

        // Calculate date range for the target month
        const startOfMonth = new Date(targetMonth);
        const endOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        console.log(`[AUTO-FILL] Getting vaccination records for: ${format(targetMonth, 'yyyy-MM')}`);
        console.log(`[AUTO-FILL] Date range: ${format(startOfMonth, 'yyyy-MM-dd')} to ${format(endOfMonth, 'yyyy-MM-dd')}`);

        // 1. Get all active vaccine types
        const vaccineTypes = await prisma.vaccineType.findMany({
            where: { isActive: true },
            select: { id: true, name: true }
        });

        // 2. Count vaccination records for the target month, grouped by vaccineTypeId and doseNumber
        const doseCounts = await prisma.vaccinationRecord.groupBy({
            by: ['vaccineTypeId', 'doseNumber'],
            where: {
                dateGiven: {
                    gte: startOfMonth,
                    lte: endOfMonth
                },
                isComplete: true
            },
            _count: {
                id: true
            }
        });

        console.log(`[AUTO-FILL] Found ${doseCounts.length} dose count combinations`);

        // 3. Create doseCounts array for frontend
        const formattedDoseCounts = doseCounts.map(dc => ({
            vaccineTypeId: dc.vaccineTypeId,
            doseNumber: dc.doseNumber,
            countGiven: dc._count.id
        }));

        // 4. Create inventory data - set "spent" = total doses given, others = 0
        const inventories = vaccineTypes.map(vaccine => {
            // Calculate total spent for this vaccine (sum of all doses)
            const totalSpent = doseCounts
                .filter(dc => dc.vaccineTypeId === vaccine.id)
                .reduce((sum, dc) => sum + dc._count.id, 0);

            console.log(`[AUTO-FILL] Vaccine ${vaccine.name} (${vaccine.id}): ${totalSpent} doses spent`);

            return {
                vaccineTypeId: vaccine.id,
                received: 0, // User will enter this manually
                spent: totalSpent, // Auto-filled from vaccination records
                opened: 0,   // User will enter this manually
                spoiled: 0,  // User will enter this manually
                returned: 0  // User will enter this manually
            };
        });

        // 5. Calculate special counts with improved queries
        const special = await calculateSpecialCounts(startOfMonth, endOfMonth);

        const response = {
            doseCounts: formattedDoseCounts,
            inventories: inventories,
            special: special
        };

        console.log(`[AUTO-FILL] Auto-fill completed for ${format(targetMonth, 'yyyy-MM')}`);
        console.log(`[AUTO-FILL] Total doses found: ${doseCounts.reduce((sum, dc) => sum + dc._count.id, 0)}`);

        res.json({
            success: true,
            data: response
        });

    } catch (err) {
        console.error('autoFillInventory error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to auto-fill inventory data',
            error: err.message
        });
    }
};

/**
 * Calculate special counts from vaccination records
 */
async function calculateSpecialCounts(startOfMonth, endOfMonth) {
    try {
        const fullWithin23m = await calculateFullVaccinationWithin23Months(startOfMonth, endOfMonth);
        const started24To59m = await calculateStartedVaccination24To59Months(startOfMonth, endOfMonth);
        const { normal: aefiNormal, serious: aefiSerious } = await calculateAEFICases(startOfMonth, endOfMonth);

        return {
            fullWithin23m,
            started24To59m,
            aefiNormal,
            aefiSerious
        };
    } catch (err) {
        console.error('Error calculating special counts:', err);
        return {
            fullWithin23m: 0,
            started24To59m: 0,
            aefiNormal: 0,
            aefiSerious: 0
        };
    }
}

/**
 * Calculate children who completed full vaccination within 23 months
 */
async function calculateFullVaccinationWithin23Months(startOfMonth, endOfMonth) {
    try {
        const twentyThreeMonthsAgo = new Date();
        twentyThreeMonthsAgo.setMonth(twentyThreeMonthsAgo.getMonth() - 23);

        const result = await prisma.$queryRaw`
            SELECT COUNT(DISTINCT c.id) 
            FROM "Child" c
            WHERE c."purnaKhop" = true
            AND c."birthDate" >= ${twentyThreeMonthsAgo}::date
            AND (
                SELECT MAX(v."dateGiven") 
                FROM "VaccinationRecord" v
                INNER JOIN "Dose" d ON d."vaccineTypeId" = v."vaccineTypeId" 
                    AND d."doseNumber" = v."doseNumber" 
                    AND d."scheduleVersionId" = 1  -- Assuming default schedule version
                WHERE v."citizenId" = c.id 
                AND v."isComplete" = true 
                AND d."isBooster" = false
            ) BETWEEN ${startOfMonth} AND ${endOfMonth}
        `;

        return Number(result[0].count) || 0;
    } catch (err) {
        console.error('Error calculating full vaccination within 23 months:', err);
        return 0;
    }
}

/**
 * Calculate children who started vaccination between 24-59 months
 */
async function calculateStartedVaccination24To59Months(startOfMonth, endOfMonth) {
    try {
        const twentyFourMonthsAgo = new Date();
        twentyFourMonthsAgo.setMonth(twentyFourMonthsAgo.getMonth() - 24);

        const fiftyNineMonthsAgo = new Date();
        fiftyNineMonthsAgo.setMonth(fiftyNineMonthsAgo.getMonth() - 59);

        const result = await prisma.$queryRaw`
            SELECT COUNT(DISTINCT c.id) 
            FROM "Child" c
            WHERE c."birthDate" BETWEEN ${fiftyNineMonthsAgo}::date AND ${twentyFourMonthsAgo}::date
            AND (
                SELECT MIN(v."dateGiven") 
                FROM "VaccinationRecord" v
                WHERE v."citizenId" = c.id 
                AND v."isComplete" = true
            ) BETWEEN ${startOfMonth} AND ${endOfMonth}
        `;

        return Number(result[0].count) || 0;
    } catch (err) {
        console.error('Error calculating started vaccination 24-59 months:', err);
        return 0;
    }
}

/**
 * Calculate AEFI cases - placeholder implementation
 * You'll need to implement proper AEFI tracking in your system
 */
async function calculateAEFICases(startOfMonth, endOfMonth) {
    // Placeholder - you should implement proper AEFI tracking
    // This could be a separate AEFI model in your schema
    console.log('[AUTO-FILL] AEFI calculation not implemented - returning placeholder values');

    return {
        normal: 0,
        serious: 0
    };
}

/**
 * POST /api/analytics/refresh-cache
 * Clear analytics cache
 */
export const refreshCache = (_, res) => {
    console.log('[CACHE] Clearing all analytics cache');
    clearCache();
    res.json({ success: true, message: 'Cache cleared' });
};