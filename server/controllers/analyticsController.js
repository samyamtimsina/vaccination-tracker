// File: server/controllers/analyticsController.js
import { prisma } from '../utils/prisma.js';
import { cachedAnalytics, clearCache, getFactsStatus } from '../utils/analyticsCache.js';
import { format } from 'date-fns';
// Add this debug function
async function debugFactsData() {
    console.log('🔍 DEBUGGING FACTS DATA:');

    // Check Child Facts
    const childFacts = await prisma.childAnalyticsFact.findMany({
        where: { day: new Date(), vaccineTypeId: 0 },
        take: 5
    });
    console.log('CHILD FACTS (vaccineTypeId=0):', childFacts);

    // Check Mother Facts
    const motherFacts = await prisma.motherAnalyticsFact.findMany({
        where: { day: new Date(), doseNumber: 0 },
        take: 5
    });
    console.log('MOTHER FACTS (doseNumber=0):', motherFacts);

    // Check Growth Facts
    const growthFacts = await prisma.growthAnalyticsFact.findMany({
        where: { day: new Date() },
        take: 5
    });
    console.log('GROWTH FACTS:', growthFacts);

    // Check raw counts
    const [childCount, motherCount, growthCount] = await Promise.all([
        prisma.childAnalyticsFact.aggregate({
            _sum: { totalRegisteredChildren: true },
            where: { day: new Date(), vaccineTypeId: 0 }
        }),
        prisma.motherAnalyticsFact.aggregate({
            _sum: { totalRegisteredMothers: true },
            where: { day: new Date(), doseNumber: 0 }
        }),
        prisma.growthAnalyticsFact.aggregate({
            _sum: { totalWeightRecords: true },
            where: { day: new Date() }
        })
    ]);

    console.log('TOTALS - Children:', childCount._sum.totalRegisteredChildren, 'Mothers:', motherCount._sum.totalRegisteredMothers, 'Growth:', growthCount._sum.totalWeightRecords);
}

// Helper: today’s delta vaccinations (children)
async function getTodayChildDelta(ward, casteCode, gender, ageGroup) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const meta = await getFactsStatus();
    if (meta?.lastProcessedChild >= today) return 0;

    return prisma.vaccinationRecord.count({
        where: {
            dateGiven: { gte: today },
            isComplete: true,
            child: {
                ...(ward ? { wardNumber: Number(ward) } : {}),
                ...(casteCode ? { casteCode: Number(casteCode) } : {}),
                ...(gender ? { gender } : {}),
                ...(ageGroup ? {
                    birthDate: {
                        gte: (() => {
                            const now = new Date();
                            if (ageGroup === '0-1y') return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                            if (ageGroup === '1-5y') return new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
                            return new Date(0);
                        })()
                    }
                } : {})
            }
        }
    });
}

// 1. System Overview: Children, Mothers, Nutrition, Coverage
// 1. System Overview: Children, Mothers, Nutrition, Coverage
// 1. System Overview: Children, Mothers, Nutrition, Coverage
export const getSystemOverview = async (req, res) => {
    const {
        ward, casteCode, gender, ageGroup,
        startDate = format(new Date(Date.now() - 30 * 864e5), 'yyyy-MM-dd'),
        endDate = format(new Date(), 'yyyy-MM-dd')
    } = req.query;

    const cacheKey = `overview:${ward}:${casteCode}:${gender}:${ageGroup}:${startDate}:${endDate}`;

    const data = await cachedAnalytics(cacheKey, async () => {
        console.log('🔄 Generating fresh overview data...');

        // Children - ONLY get overall summary records (vaccineTypeId = 0)
        const childWhere = {
            day: { gte: new Date(startDate), lte: new Date(endDate) },
            vaccineTypeId: 0, // CRITICAL: Only overall summary records
            doseNumber: 0,    // CRITICAL: Only overall summary records  
            ...(ward ? { ward: Number(ward) } : {}),
            ...(casteCode ? { casteCode: Number(casteCode) } : {}),
            ...(gender ? { gender } : {}),
            ...(ageGroup ? { ageGroup } : {})
        };

        const childAgg = await prisma.childAnalyticsFact.aggregate({
            _sum: {
                totalRegisteredChildren: true,
                vaccinatedChildren: true,
                zeroDoseChildren: true,
                dueToday: true,
                overdue: true,
                onTime: true,
                late: true
            },
            _avg: { dropoutRate: true },
            where: childWhere
        });

        console.log('🔍 CHILD DATA:', {
            total: childAgg._sum.totalRegisteredChildren,
            vaccinated: childAgg._sum.vaccinatedChildren,
            zeroDose: childAgg._sum.zeroDoseChildren,
            dropout: childAgg._avg.dropoutRate
        });

        const deltaVacc = await getTodayChildDelta(ward, casteCode, gender, ageGroup);
        const totalVaccinated = (childAgg._sum.vaccinatedChildren || 0) + deltaVacc;
        const totalChildren = childAgg._sum.totalRegisteredChildren || 1;

        // Mothers - ONLY get overall summary records (doseNumber = 0)
        const motherWhere = {
            day: { gte: new Date(startDate), lte: new Date(endDate) },
            doseNumber: 0, // CRITICAL: Only overall summary records
            ...(ward ? { ward: Number(ward) } : {}),
            ...(casteCode ? { casteCode: Number(casteCode) } : {}),
            // Note: Mother facts don't have gender/ageGroup in your schema
        };

        const motherAgg = await prisma.motherAnalyticsFact.aggregate({
            _sum: {
                totalRegisteredMothers: true,
                tdDosesGiven: true,
                mothersWithZeroTD: true,
                mothersWithFullTD: true,
                overdue: true
            },
            where: motherWhere
        });

        console.log('🔍 MOTHER DATA:', {
            total: motherAgg._sum.totalRegisteredMothers,
            tdDoses: motherAgg._sum.tdDosesGiven,
            zeroTD: motherAgg._sum.mothersWithZeroTD,
            fullTD: motherAgg._sum.mothersWithFullTD
        });

        // Nutrition / growth
        const growthWhere = {
            day: { gte: new Date(startDate), lte: new Date(endDate) },
            ...(ward ? { ward: Number(ward) } : {}),
            ...(casteCode ? { casteCode: Number(casteCode) } : {}),
            ...(gender ? { gender } : {}),
            ...(ageGroup ? { ageGroup } : {})
        };

        const growthAgg = await prisma.growthAnalyticsFact.aggregate({
            _sum: {
                totalWeightRecords: true,
                underweightCount: true,
                normalWeightCount: true,
                overweightCount: true
            },
            _avg: { avgWeightKg: true },
            where: growthWhere
        });

        console.log('🔍 GROWTH DATA:', {
            totalRecords: growthAgg._sum.totalWeightRecords,
            avgWeight: growthAgg._avg.avgWeightKg,
            underweight: growthAgg._sum.underweightCount,
            normal: growthAgg._sum.normalWeightCount,
            overweight: growthAgg._sum.overweightCount
        });

        return {
            children: {
                totalRegistered: childAgg._sum.totalRegisteredChildren || 0,
                vaccinated: totalVaccinated,
                zeroDose: childAgg._sum.zeroDoseChildren || 0,
                coverageRate: (totalVaccinated / totalChildren) * 100,
                dropoutRate: childAgg._avg.dropoutRate || 0,
                dueToday: childAgg._sum.dueToday || 0,
                overdue: childAgg._sum.overdue || 0,
                onTime: childAgg._sum.onTime || 0,
                late: childAgg._sum.late || 0
            },
            mothers: {
                totalRegistered: motherAgg._sum.totalRegisteredMothers || 0,
                tdDosesGiven: motherAgg._sum.tdDosesGiven || 0,
                zeroTD: motherAgg._sum.mothersWithZeroTD || 0,
                fullTD: motherAgg._sum.mothersWithFullTD || 0,
                tdCoverage: ((motherAgg._sum.mothersWithFullTD || 0) / (motherAgg._sum.totalRegisteredMothers || 1)) * 100,
                overdue: motherAgg._sum.overdue || 0
            },
            nutrition: {
                totalRecords: growthAgg._sum.totalWeightRecords || 0,
                avgWeightKg: growthAgg._avg.avgWeightKg || 0,
                underweightRate: ((growthAgg._sum.underweightCount || 0) / (growthAgg._sum.totalWeightRecords || 1)) * 100,
                normalRate: ((growthAgg._sum.normalWeightCount || 0) / (growthAgg._sum.totalWeightRecords || 1)) * 100,
                overweightRate: ((growthAgg._sum.overweightCount || 0) / (growthAgg._sum.totalWeightRecords || 1)) * 100
            }
        };
    });

    res.json({ success: true, data });
};
// 2. Coverage per vaccine
export const getVaccineCoverage = async (req, res) => {
    const { ward, casteCode, gender, ageGroup, vaccineTypeId, doseNumber, startDate = '2020-01-01', endDate = format(new Date(), 'yyyy-MM-dd') } = req.query;
    const cacheKey = `coverage:${ward}:${casteCode}:${gender}:${ageGroup}:${vaccineTypeId}:${doseNumber}:${startDate}:${endDate}`;

    const data = await cachedAnalytics(cacheKey, async () => {
        const where = {
            day: { gte: new Date(startDate), lte: new Date(endDate) },
            ...(ward ? { ward: Number(ward) } : {}),
            ...(casteCode ? { casteCode: Number(casteCode) } : {}),
            ...(gender ? { gender } : {}),
            ...(ageGroup ? { ageGroup } : {}),
            ...(vaccineTypeId ? { vaccineTypeId: Number(vaccineTypeId) } : {}),
            ...(doseNumber ? { doseNumber: Number(doseNumber) } : {})
        };

        const facts = await prisma.childAnalyticsFact.groupBy({
            by: ['vaccineTypeId', 'doseNumber', 'ward', 'gender', 'ageGroup', 'casteCode'],
            _sum: { vaccinatedChildren: true, totalRegisteredChildren: true, zeroDoseChildren: true },
            where
        });

        return facts.map(f => ({
            vaccineTypeId: f.vaccineTypeId,
            doseNumber: f.doseNumber,
            ward: f.ward,
            gender: f.gender,
            ageGroup: f.ageGroup,
            casteCode: f.casteCode,
            vaccinated: f._sum.vaccinatedChildren || 0,
            total: f._sum.totalRegisteredChildren || 0,
            zeroDose: f._sum.zeroDoseChildren || 0,
            coverage: ((f._sum.vaccinatedChildren || 0) / (f._sum.totalRegisteredChildren || 1)) * 100
        }));
    });

    res.json({ success: true, data });
};

// 3. Dropout rates
export const getDropoutRates = async (req, res) => {
    const { ward, casteCode, gender, ageGroup, vaccineTypeId, startDate = '2020-01-01', endDate = format(new Date(), 'yyyy-MM-dd') } = req.query;
    const cacheKey = `dropout:${ward}:${casteCode}:${gender}:${ageGroup}:${vaccineTypeId}:${startDate}:${endDate}`;

    const data = await cachedAnalytics(cacheKey, async () => {
        const where = {
            day: { gte: new Date(startDate), lte: new Date(endDate) },
            ...(ward ? { ward: Number(ward) } : {}),
            ...(casteCode ? { casteCode: Number(casteCode) } : {}),
            ...(gender ? { gender } : {}),
            ...(ageGroup ? { ageGroup } : {}),
            ...(vaccineTypeId ? { vaccineTypeId: Number(vaccineTypeId) } : {})
        };

        const facts = await prisma.childAnalyticsFact.groupBy({
            by: ['vaccineTypeId', 'ward', 'casteCode', 'gender', 'ageGroup'],
            _avg: { dropoutRate: true },
            where
        });

        return facts.map(f => ({
            vaccineTypeId: f.vaccineTypeId,
            ward: f.ward,
            casteCode: f.casteCode,
            gender: f.gender,
            ageGroup: f.ageGroup,
            dropoutRate: (f._avg.dropoutRate || 0) * 100
        }));
    });

    res.json({ success: true, data });
};

// 4. Zero-dose children
// 4. Zero-dose children
export const getZeroDoseChildren = async (req, res) => {
    const { ward, casteCode, gender, ageGroup, startDate = '2020-01-01', endDate = format(new Date(), 'yyyy-MM-dd') } = req.query;
    const cacheKey = `zerodose:${ward}:${casteCode}:${gender}:${ageGroup}:${startDate}:${endDate}`;

    const data = await cachedAnalytics(cacheKey, async () => {
        const where = {
            day: { gte: new Date(startDate), lte: new Date(endDate) },
            vaccineTypeId: 0, // ONLY overall summary records
            doseNumber: 0,    // ONLY overall summary records
            ...(ward ? { ward: Number(ward) } : {}),
            ...(casteCode ? { casteCode: Number(casteCode) } : {}),
            ...(gender ? { gender } : {}),
            ...(ageGroup ? { ageGroup } : {})
        };

        const agg = await prisma.childAnalyticsFact.aggregate({
            _sum: { zeroDoseChildren: true, totalRegisteredChildren: true },
            where
        });

        return {
            zeroDoseCount: agg._sum.zeroDoseChildren || 0,
            zeroDoseRate: ((agg._sum.zeroDoseChildren || 0) / (agg._sum.totalRegisteredChildren || 1)) * 100
        };
    });

    res.json({ success: true, data });
};
// 5. Growth/Nutrition monitoring
export const getGrowthMonitoring = async (req, res) => {
    const { ward, casteCode, gender, ageGroup, startDate = '2020-01-01', endDate = format(new Date(), 'yyyy-MM-dd') } = req.query;
    const cacheKey = `growth:${ward}:${casteCode}:${gender}:${ageGroup}:${startDate}:${endDate}`;

    const data = await cachedAnalytics(cacheKey, async () => {
        const where = {
            day: { gte: new Date(startDate), lte: new Date(endDate) },
            ...(ward ? { ward: Number(ward) } : {}),
            ...(casteCode ? { casteCode: Number(casteCode) } : {}),
            ...(gender ? { gender } : {}),
            ...(ageGroup ? { ageGroup } : {})
        };

        const agg = await prisma.growthAnalyticsFact.aggregate({
            _sum: { totalWeightRecords: true, underweightCount: true, normalWeightCount: true, overweightCount: true },
            _avg: { avgWeightKg: true },
            where
        });

        return {
            totalRecords: agg._sum.totalWeightRecords || 0,
            avgWeightKg: agg._avg.avgWeightKg || 0,
            underweightRate: ((agg._sum.underweightCount || 0) / (agg._sum.totalWeightRecords || 1)) * 100,
            normalRate: ((agg._sum.normalWeightCount || 0) / (agg._sum.totalWeightRecords || 1)) * 100,
            overweightRate: ((agg._sum.overweightCount || 0) / (agg._sum.totalWeightRecords || 1)) * 100
        };
    });

    res.json({ success: true, data });
};

// 6. Mothers TD coverage
export const getTDCoverage = async (req, res) => {
    const { ward, casteCode, doseNumber, startDate = '2020-01-01', endDate = format(new Date(), 'yyyy-MM-dd') } = req.query;
    const cacheKey = `tdcoverage:${ward}:${casteCode}:${doseNumber}:${startDate}:${endDate}`;

    const data = await cachedAnalytics(cacheKey, async () => {
        const where = {
            day: { gte: new Date(startDate), lte: new Date(endDate) },
            ...(ward ? { ward: Number(ward) } : {}),
            ...(casteCode ? { casteCode: Number(casteCode) } : {}),
            ...(doseNumber ? { doseNumber: Number(doseNumber) } : {})
        };

        const facts = await prisma.motherAnalyticsFact.groupBy({
            by: ['ward', 'casteCode', 'doseNumber'],
            _sum: { tdDosesGiven: true, totalRegisteredMothers: true, mothersWithFullTD: true },
            where
        });

        return facts.map(f => ({
            ward: f.ward,
            casteCode: f.casteCode,
            doseNumber: f.doseNumber,
            tdDosesGiven: f._sum.tdDosesGiven || 0,
            totalMothers: f._sum.totalRegisteredMothers || 0,
            fullTD: f._sum.mothersWithFullTD || 0,
            coverage: ((f._sum.tdDosesGiven || 0) / (f._sum.totalRegisteredMothers || 1)) * 100
        }));
    });

    res.json({ success: true, data });
};

// 7. Cache refresh
export const refreshCache = async (req, res) => {
    clearCache();
    res.json({ success: true, message: 'Cache cleared' });
};

// 8. Facts status
export const getFactsStatusController = async (req, res) => {
    const data = await getFactsStatus();
    res.json({ success: true, data });
};

export const getDueOverdue = async (req, res) => {
    try {
        const {
            ward,
            casteCode,
            gender,
            ageGroup,
            startDate = format(new Date(), 'yyyy-MM-dd'),
            endDate = format(new Date(), 'yyyy-MM-dd'),
        } = req.query;

        const cacheKey = `dueoverdue:${ward}:${casteCode}:${gender}:${ageGroup}:${startDate}:${endDate}`;

        const data = await cachedAnalytics(cacheKey, async () => {
            const where = {
                day: { gte: new Date(startDate), lte: new Date(endDate) },
                vaccineTypeId: 0, // ONLY overall summary records
                doseNumber: 0,    // ONLY overall summary records
                ...(ward ? { ward: Number(ward) } : {}),
                ...(casteCode ? { casteCode: Number(casteCode) } : {}),
                ...(gender ? { gender } : {}),
                ...(ageGroup ? { ageGroup } : {}),
            };

            const agg = await prisma.childAnalyticsFact.aggregate({
                _sum: {
                    dueToday: true,
                    overdue: true,
                    onTime: true,
                    late: true,
                },
                where,
            });

            return {
                dueToday: agg._sum.dueToday || 0,
                overdue: agg._sum.overdue || 0,
                onTime: agg._sum.onTime || 0,
                late: agg._sum.late || 0,
                timelinessRate:
                    ((agg._sum.onTime || 0) /
                        ((agg._sum.onTime || 0) + (agg._sum.late || 0) || 1)) *
                    100,
            };
        });

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error in getDueOverdue:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};