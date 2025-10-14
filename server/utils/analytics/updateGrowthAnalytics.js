import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

/**
 * Incrementally updates growth/nutrition analytics (smart upsert version)
 */
export async function updateGrowthAnalytics() {
    console.time('growth-analytics-update');
    const domain = 'growth';
    const now = new Date();
    const batchSize = 5000;

    try {
        // 1️⃣ Last processed timestamp
        const meta = await prisma.analyticsMeta.findUnique({ where: { domain } });
        const lastProcessed = meta ? meta.lastProcessedTimestamptz : new Date(0);

        console.log(`[Growth] Processing new weight records since: ${lastProcessed.toISOString()}`);

        // 2️⃣ Fetch new WeightRecords
        const weightRecords = [];
        let skip = 0;

        while (true) {
            const batch = await prisma.weightRecord.findMany({
                where: {
                    createdAt: { gt: lastProcessed, lte: now },
                },
                skip,
                take: batchSize,
                select: {
                    weight: true,
                    date: true,
                    wardOfVaccination: true,
                    child: {
                        select: { gender: true, birthDate: true },
                    },
                },
            });

            weightRecords.push(...batch);
            console.log(`[Growth] Fetched ${batch.length} weight records (skip=${skip})`);
            if (batch.length < batchSize) break;
            skip += batchSize;
        }

        console.log(`[Growth] Total new weight records fetched: ${weightRecords.length}`);

        if (weightRecords.length === 0) {
            console.log('[Growth] No new records to process ✅');
            console.timeEnd('growth-analytics-update');
            return;
        }

        // 3️⃣ Helper functions
        const getAgeMonths = (birthDate) =>
            (now - new Date(birthDate)) / (1000 * 60 * 60 * 24 * 30.44);

        const getExpectedWeight = (months) => {
            if (months < 12) return 8;
            if (months < 24) return 11;
            if (months < 60) return 16;
            return 20;
        };

        const getAgeGroup = (months) => {
            if (months < 12) return '0-1yr';
            if (months < 24) return '1-2yrs';
            if (months < 60) return '2-5yrs';
            return '5+yrs';
        };

        // 4️⃣ Aggregate
        const aggMap = new Map();

        for (const rec of weightRecords) {
            const ageMonths = getAgeMonths(rec.child.birthDate);
            const expected = getExpectedWeight(ageMonths);
            const ratio = rec.weight / expected;

            const key = [
                rec.wardOfVaccination,
                rec.child.gender,
                getAgeGroup(ageMonths),
            ].join('|');

            const group = aggMap.get(key) || {
                day: new Date(now.toISOString().split('T')[0]), // truncate to date only
                ward: rec.wardOfVaccination,
                gender: rec.child.gender,
                ageGroup: getAgeGroup(ageMonths),
                underweightCount: 0,
                severelyUnderweightCount: 0,
                normalWeightCount: 0,
                overweightCount: 0,
                avgWeight: 0,
                recordsCount: 0,
            };

            group.recordsCount++;
            group.avgWeight += rec.weight;

            if (ratio < 0.7) group.severelyUnderweightCount++;
            else if (ratio < 0.8) group.underweightCount++;
            else if (ratio <= 1.2) group.normalWeightCount++;
            else group.overweightCount++;

            aggMap.set(key, group);
        }

        const entries = Array.from(aggMap.values()).map((g) => ({
            ...g,
            avgWeight: g.recordsCount > 0 ? g.avgWeight / g.recordsCount : 0,
        }));

        console.log(`[Growth] Aggregating ${entries.length} metric groups...`);

        // 5️⃣ UPSERT instead of CREATE
        for (const entry of entries) {
            await prisma.growthAnalyticsFact.upsert({
                where: {
                    // Unique per day + ward + gender + ageGroup
                    day_ward_gender_ageGroup: {
                        day: entry.day,
                        ward: entry.ward,
                        gender: entry.gender,
                        ageGroup: entry.ageGroup,
                    },
                },
                update: {
                    underweightCount: { increment: entry.underweightCount },
                    severelyUnderweightCount: { increment: entry.severelyUnderweightCount },
                    normalWeightCount: { increment: entry.normalWeightCount },
                    overweightCount: { increment: entry.overweightCount },
                    recordsCount: { increment: entry.recordsCount },
                    avgWeight: {
                        set: entry.avgWeight, // override with most recent average
                    },
                },
                create: entry,
            });
        }

        console.log(`[Growth] Upserted ${entries.length} analytics facts.`);

        // 6️⃣ Update meta
        await prisma.analyticsMeta.upsert({
            where: { domain },
            update: { lastProcessedTimestamptz: now },
            create: { domain, lastProcessedTimestamptz: now },
        });

        console.log(`[Growth] Growth analytics updated successfully ✅`);
        console.timeEnd('growth-analytics-update');
    } catch (err) {
        console.error('❌ Error updating growth analytics:', err);
    } finally {
        await prisma.$disconnect();
    }
}
