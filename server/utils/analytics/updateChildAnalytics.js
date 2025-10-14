import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

/**
 * Incrementally updates child immunization analytics facts.
 */
export async function updateChildAnalytics() {
    console.time('child-analytics-update');
    const domain = 'child';
    const now = new Date();

    // Define batch size upfront
    const batchSize = 5000;

    try {
        // 1️ Last processed timestamp
        const meta = await prisma.analyticsMeta.findUnique({ where: { domain } });
        const lastProcessed = meta ? meta.lastProcessedTimestamptz : new Date(0);

        console.log(`[Analytics] Processing new records since: ${lastProcessed.toISOString()}`);
        console.log(`[Analytics] Using batch size: ${batchSize}`); // Log batch size

        // 2️ Fetch recent vaccination records
        const vaccinationRecords = [];

        let skip = 0;
        let totalRecordsFetched = 0;

        console.log('[Analytics] Starting batch fetch for Vaccination Records...'); // New Log

        while (true) {
            console.log(`[Analytics] Fetching VR batch (skip: ${skip}, take: ${batchSize})...`); // New Log: Tracks progress

            const batch = await prisma.vaccinationRecord.findMany({
                where: {
                    dateGiven: { gt: lastProcessed, lte: now },
                },
                skip,
                take: batchSize,
                select: {
                    vaccineTypeId: true,
                    doseNumber: true,
                    dateGiven: true,
                    isExternallyAdministered: true,
                    wardOfVaccination: true,
                    child: {
                        select: { gender: true, birthDate: true },
                    },
                },
            });

            console.log(`[Analytics] Fetched ${batch.length} records in this VR batch.`); // New Log: Confirms successful fetch or will fail before this point

            //  Convert all non-string types safely here
            for (const v of batch) {
                try {
                    // force to primitive string-safe versions
                    v.wardOfVaccination = Number(v.wardOfVaccination);
                    v.vaccineTypeId = Number(v.vaccineTypeId);
                    v.doseNumber = Number(v.doseNumber);
                    v.isExternallyAdministered = !!v.isExternallyAdministered;
                    v.child.gender = String(v.child.gender || '');
                    v.child.birthDate = new Date(v.child.birthDate);
                    vaccinationRecords.push(v);
                } catch (err) {
                    // This catches JavaScript conversion errors, not the Rust/NAPI error
                    console.warn('[Analytics] Skipping corrupt vaccination record during JS conversion:', err.message);
                }
            }

            totalRecordsFetched += batch.length;

            if (batch.length < batchSize) break;
            skip += batchSize;
        }

        console.log(`[Analytics] Total vaccination records fetched: ${totalRecordsFetched}`); // Updated Log

        // 3️ Fetch due vaccine updates
        const dueVaccines = [];
        skip = 0;
        totalRecordsFetched = 0;

        console.log('[Analytics] Starting batch fetch for Child Due Vaccines...'); // New Log

        while (true) {
            console.log(`[Analytics] Fetching DV batch (skip: ${skip}, take: ${batchSize})...`); // New Log: Tracks progress

            const batch = await prisma.childDueVaccine.findMany({
                where: {
                    createdAt: { gt: lastProcessed, lte: now },
                },
                skip,
                take: batchSize,
                select: {
                    dueDate: true,
                    isCompleted: true,
                    vaccineTypeId: true,
                    doseNumber: true,
                    child: {
                        select: { wardNumber: true, gender: true, birthDate: true },
                    },
                },
            });

            console.log(`[Analytics] Fetched ${batch.length} records in this DV batch.`); // New Log

            for (const d of batch) {
                try {
                    d.vaccineTypeId = Number(d.vaccineTypeId);
                    d.doseNumber = Number(d.doseNumber);
                    d.isCompleted = !!d.isCompleted;
                    d.child.wardNumber = Number(d.child.wardNumber);
                    d.child.gender = String(d.child.gender || '');
                    d.child.birthDate = new Date(d.child.birthDate);
                    dueVaccines.push(d);
                } catch (err) {
                    console.warn('[Analytics] Skipping corrupt due vaccine record during JS conversion:', err.message);
                }
            }

            totalRecordsFetched += batch.length;

            if (batch.length < batchSize) break;
            skip += batchSize;
        }

        console.log(`[Analytics] Total due vaccine records fetched: ${totalRecordsFetched}`); // Updated Log


        // Helper: age group bucket
        const getAgeGroup = (birthDate) => {
            const ageMonths = (now - new Date(birthDate)) / (1000 * 60 * 60 * 24 * 30.44);
            if (ageMonths < 12) return '0-1yr';
            if (ageMonths < 24) return '1-2yrs';
            if (ageMonths < 60) return '2-5yrs';
            return '5+yrs';
        };

        // 4️ Aggregate metrics (The original step 4 was missing, I renamed the next step)
        // ️⃣ Aggregate metrics
        const aggMap = new Map();

        console.log(`[Analytics] Starting aggregation for ${vaccinationRecords.length} fetched VRs.`); // New log

        for (const v of vaccinationRecords) {
            const key = [
                v.wardOfVaccination,
                v.vaccineTypeId,
                v.doseNumber,
                v.child.gender,
                getAgeGroup(v.child.birthDate),
                v.isExternallyAdministered,
            ].join('|');

            const existing = aggMap.get(key) || {
                day: now,
                ward: v.wardOfVaccination,
                vaccineTypeId: v.vaccineTypeId,
                doseNumber: v.doseNumber,
                gender: v.child.gender,
                ageGroup: getAgeGroup(v.child.birthDate),
                isExternal: v.isExternallyAdministered,
                vaccinatedChildren: 0,
                dueToday: 0,
                overdue: 0,
                upcomingDue: 0,
            };

            existing.vaccinatedChildren += 1;
            aggMap.set(key, existing);
        }

        console.log(`[Analytics] Starting aggregation for ${dueVaccines.length} fetched DVs.`); // New log

        for (const d of dueVaccines) {
            const key = [
                d.child.wardNumber,
                d.vaccineTypeId,
                d.doseNumber,
                d.child.gender,
                getAgeGroup(d.child.birthDate),
                false,
            ].join('|');

            const existing = aggMap.get(key) || {
                day: now,
                ward: d.child.wardNumber,
                vaccineTypeId: d.vaccineTypeId,
                doseNumber: d.doseNumber,
                gender: d.child.gender,
                ageGroup: getAgeGroup(d.child.birthDate),
                isExternal: false,
                vaccinatedChildren: 0,
                dueToday: 0,
                overdue: 0,
                upcomingDue: 0,
            };

            const today = new Date();
            // Normalize today for comparison (set to start of day)
            today.setHours(0, 0, 0, 0);

            if (!d.isCompleted) {
                const dueDate = new Date(d.dueDate);
                dueDate.setHours(0, 0, 0, 0); // Normalize due date for comparison

                if (dueDate < today) existing.overdue += 1;
                else if (dueDate.getTime() === today.getTime()) existing.dueToday += 1;
                else existing.upcomingDue += 1;
            }

            aggMap.set(key, existing);
        }

        // 5️ Write to DB
        const entries = Array.from(aggMap.values());
        console.log(`[Analytics] Aggregating ${entries.length} metric groups...`);

        // Use a transaction to ensure all writes succeed or none do
        await prisma.$transaction(
            entries.map(entry =>
                prisma.childAnalyticsFact.create({ data: entry })
            )
        );
        console.log(`[Analytics] Wrote ${entries.length} new analytics facts.`);


        // 6️ Update meta timestamp
        console.log('[Analytics] Updating analytics meta timestamp...'); // New log
        await prisma.analyticsMeta.upsert({
            where: { domain },
            update: { lastProcessedTimestamptz: now },
            create: { domain, lastProcessedTimestamptz: now },
        });

        console.log(`[Analytics] Child analytics updated successfully ✅`);
        console.timeEnd('child-analytics-update');
    } catch (err) {
        console.error('❌ Error updating child analytics:', err);
    } finally {
        await prisma.$disconnect();
    }
}
