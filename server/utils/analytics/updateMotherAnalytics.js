// services/updateMotherAnalytics.js
import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

/**
 * Incrementally updates maternal immunization analytics.
 */
export async function updateMotherAnalytics() {
    console.time('mother-analytics-update');
    const domain = 'mother';
    const now = new Date();
    const batchSize = 5000;

    try {
        // 1️⃣ Get last processed timestamp
        const meta = await prisma.analyticsMeta.findUnique({ where: { domain } });
        const lastProcessed = meta ? meta.lastProcessedTimestamptz : new Date(0);
        console.log(`[Analytics] Processing mothers since: ${lastProcessed.toISOString()}`);

        // 2️⃣ Fetch mothers (for total registration count)
        const mothers = [];
        let skip = 0;

        while (true) {
            const batch = await prisma.mother.findMany({
                where: { createdAt: { gt: lastProcessed, lte: now } },
                skip,
                take: batchSize,
                select: { wardNumber: true, dateOfBirth: true },
            });
            mothers.push(...batch);
            if (batch.length < batchSize) break;
            skip += batchSize;
        }

        console.log(`[Analytics] Fetched ${mothers.length} new mothers.`);

        // 3️⃣ Fetch TD Doses since last update
        const tdDoses = [];
        skip = 0;
        while (true) {
            const batch = await prisma.tDDose.findMany({
                where: { dateGiven: { gt: lastProcessed, lte: now } },
                skip,
                take: batchSize,
                select: {
                    doseNumber: true,
                    dateGiven: true,
                    mother: { select: { id: true, wardNumber: true, dateOfBirth: true } },
                },
            });
            tdDoses.push(...batch);
            if (batch.length < batchSize) break;
            skip += batchSize;
        }

        console.log(`[Analytics] Fetched ${tdDoses.length} TD dose records.`);

        // Helper: calculate age group
        const getAgeGroup = (dob) => {
            const years = (now - new Date(dob)) / (1000 * 60 * 60 * 24 * 365.25);
            if (years < 20) return '<20yrs';
            if (years < 30) return '20-29yrs';
            if (years < 40) return '30-39yrs';
            return '40+yrs';
        };

        // 4️⃣ Aggregate metrics
        const aggMap = new Map();

        // Mothers registered
        for (const m of mothers) {
            const key = `${m.wardNumber}|${getAgeGroup(m.dateOfBirth)}`;
            const obj = aggMap.get(key) || {
                day: now,
                ward: m.wardNumber,
                ageGroup: getAgeGroup(m.dateOfBirth),
                totalRegisteredMothers: 0,
                td1Given: 0,
                td2Given: 0,
                td2plusGiven: 0,
                tdDropoutFirstLast: 0,
                tdDropoutRate: 0,
                td2OnTime: 0,
                td2Late: 0,
            };
            obj.totalRegisteredMothers += 1;
            aggMap.set(key, obj);
        }

        // TD doses aggregation
        const motherDoseMap = new Map(); // track per mother doses
        for (const dose of tdDoses) {
            const key = `${dose.mother.id}|${dose.mother.wardNumber}`;
            if (!motherDoseMap.has(key)) motherDoseMap.set(key, []);
            motherDoseMap.get(key).push(dose);
        }

        for (const [key, doses] of motherDoseMap) {
            const ward = doses[0].mother.wardNumber;
            const ageGroup = getAgeGroup(doses[0].mother.dateOfBirth);
            const aggKey = `${ward}|${ageGroup}`;

            const obj = aggMap.get(aggKey) || {
                day: now,
                ward,
                ageGroup,
                totalRegisteredMothers: 0,
                td1Given: 0,
                td2Given: 0,
                td2plusGiven: 0,
                tdDropoutFirstLast: 0,
                tdDropoutRate: 0,
                td2OnTime: 0,
                td2Late: 0,
            };

            const sorted = doses.sort((a, b) => a.doseNumber - b.doseNumber);
            const td1 = sorted.find(d => d.doseNumber === 1);
            const td2 = sorted.find(d => d.doseNumber === 2);

            for (const d of sorted) {
                if (d.doseNumber === 1) obj.td1Given += 1;
                else if (d.doseNumber === 2) obj.td2Given += 1;
                else if (d.doseNumber > 2) obj.td2plusGiven += 1;
            }

            if (td1 && !td2) obj.tdDropoutFirstLast += 1;

            if (td1 && td2) {
                const daysDiff = (new Date(td2.dateGiven) - new Date(td1.dateGiven)) / (1000 * 60 * 60 * 24);
                if (daysDiff <= 45) obj.td2OnTime += 1;
                else obj.td2Late += 1;
            }

            aggMap.set(aggKey, obj);
        }

        // 5️⃣ Write aggregated facts
        const entries = Array.from(aggMap.values());
        console.log(`[Analytics] Writing ${entries.length} mother analytic facts...`);
        await prisma.$transaction(
            entries.map(entry =>
                prisma.motherAnalyticsFact.create({ data: entry })
            ),
            { timeout: 10000 }
        );

        // 6️⃣ Update meta
        await prisma.analyticsMeta.upsert({
            where: { domain },
            update: { lastProcessedTimestamptz: now },
            create: { domain, lastProcessedTimestamptz: now },
        });

        console.log(`[Analytics] ✅ Mother analytics updated successfully.`);
        console.timeEnd('mother-analytics-update');
    } catch (err) {
        console.error('❌ Error updating mother analytics:', err);
    } finally {
        await prisma.$disconnect();
    }
}

// You can now create a runner like `runMotherAnalytics.js`:
if (process.argv[1].includes('runMotherAnalytics.js')) {
    console.log('Running Mother Analytics Updater...');
    updateMotherAnalytics();
}
