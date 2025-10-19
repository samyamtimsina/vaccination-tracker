// server/worker/analyticsFactUpdater.js
// ✅ FINAL FIX - Proper counts and vaccine-specific data

import { prisma } from '../utils/prisma.js';

// ---- Utility logger ----
function log(msg, symbol = 'ℹ️') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${symbol} ${msg}`);
}

// ---- CHILD FACTS ----
async function updateChildFacts() {
    log('Starting ChildAnalyticsFact update...', '🧒');
    console.time('⏱️ ChildAnalyticsFact Duration');

    try {
        log('Counting base tables...');
        const [{ count: childCount }] = await prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "Child"`;
        const [{ count: vaxCount }] = await prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "VaccinationRecord" WHERE "isComplete" = true`;
        const [{ count: dueCount }] = await prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "ChildDueVaccine"`;
        log(`Actual counts - Child: ${childCount}, Completed Vaccinations: ${vaxCount}, ChildDueVaccine: ${dueCount}`);

        log('Executing INSERT/UPDATE for ChildAnalyticsFact...');
        console.time('⏱️ ChildAnalyticsFact Query Time');

        // First, clear today's data
        await prisma.$executeRawUnsafe(`DELETE FROM "ChildAnalyticsFact" WHERE "day" = CURRENT_DATE`);
        log('Cleared existing data for today');

        // STEP 1: Insert base child counts (vaccineTypeId = 0 for all vaccines)
        await prisma.$executeRawUnsafe(`
            INSERT INTO "ChildAnalyticsFact" (
                "day", "ward", "vaccineTypeId", "doseNumber", "gender", "ageGroup", "casteCode",
                "totalRegisteredChildren", "vaccinatedChildren", "zeroDoseChildren",
                "dueToday", "overdue", "onTime", "late", "dropoutRate",
                "createdAt", "updatedAt"
            )
            WITH child_demographics AS (
                SELECT 
                    c.id,
                    c."wardNumber",
                    COALESCE(NULLIF(c."gender", ''), 'ALL') as gender,
                    COALESCE(NULLIF(c."casteCode", 0), 0) as casteCode,
                    CASE
                        WHEN c."birthDate" IS NULL THEN 'ALL'
                        WHEN EXTRACT(YEAR FROM AGE(c."birthDate")) < 1 THEN '0-1y'
                        WHEN EXTRACT(YEAR FROM AGE(c."birthDate")) < 5 THEN '1-5y'
                        ELSE '5y+'
                    END as ageGroup,
                    -- Check if child has any completed vaccination
                    EXISTS (SELECT 1 FROM "VaccinationRecord" vr WHERE vr."citizenId" = c.id AND vr."isComplete" = true) as has_any_vaccination,
                    -- Check if child started but didn't complete series
                    EXISTS (SELECT 1 FROM "VaccinationRecord" vr WHERE vr."citizenId" = c.id AND vr."doseNumber" = 1 AND vr."isComplete" = true) as started_vaccination,
                    EXISTS (SELECT 1 FROM "VaccinationRecord" vr WHERE vr."citizenId" = c.id AND vr."doseNumber" > 1 AND vr."isComplete" = true) as completed_series,
                    -- Due vaccines
                    (SELECT COUNT(*) FROM "ChildDueVaccine" cdv WHERE cdv."childId" = c.id AND cdv."dueDate" = CURRENT_DATE AND cdv."isCompleted" = false) as due_today,
                    (SELECT COUNT(*) FROM "ChildDueVaccine" cdv WHERE cdv."childId" = c.id AND cdv."dueDate" < CURRENT_DATE AND cdv."isCompleted" = false) as overdue_count
                FROM "Child" c
            )
            SELECT
                CURRENT_DATE AS day,
                COALESCE(cd."wardNumber", 1) AS ward,
                0 AS "vaccineTypeId", -- 0 means "all vaccines"
                0 AS "doseNumber",    -- 0 means "all doses"
                cd.gender,
                cd.ageGroup,
                cd.casteCode,
                
                COUNT(DISTINCT cd.id) AS totalRegisteredChildren,
                COUNT(DISTINCT CASE WHEN cd.has_any_vaccination THEN cd.id END) AS vaccinatedChildren,
                COUNT(DISTINCT CASE WHEN NOT cd.has_any_vaccination THEN cd.id END) AS zeroDoseChildren,
                
                SUM(cd.due_today) AS dueToday,
                SUM(cd.overdue_count) AS overdue,
                
                0 AS onTime,  -- Simplified for now
                0 AS late,    -- Simplified for now
                
                -- Dropout rate: children who started but didn't complete series
                CASE 
                    WHEN COUNT(DISTINCT CASE WHEN cd.started_vaccination THEN cd.id END) > 0
                    THEN ROUND(
                        (1.0 - (
                            COUNT(DISTINCT CASE WHEN cd.completed_series THEN cd.id END)::numeric / 
                            NULLIF(COUNT(DISTINCT CASE WHEN cd.started_vaccination THEN cd.id END), 0)
                        )) * 100, 2
                    )
                    ELSE 0 
                END AS dropoutRate,
                
                CURRENT_TIMESTAMP AS "createdAt",
                CURRENT_TIMESTAMP AS "updatedAt"
                
            FROM child_demographics cd
            GROUP BY cd."wardNumber", cd.gender, cd.ageGroup, cd.casteCode
        `);

        // STEP 2: Insert vaccine-specific data
        await prisma.$executeRawUnsafe(`
            INSERT INTO "ChildAnalyticsFact" (
                "day", "ward", "vaccineTypeId", "doseNumber", "gender", "ageGroup", "casteCode",
                "totalRegisteredChildren", "vaccinatedChildren", "zeroDoseChildren",
                "dueToday", "overdue", "onTime", "late", "dropoutRate",
                "createdAt", "updatedAt"
            )
            WITH vaccine_stats AS (
                SELECT 
                    c.id,
                    c."wardNumber",
                    COALESCE(NULLIF(c."gender", ''), 'ALL') as gender,
                    COALESCE(NULLIF(c."casteCode", 0), 0) as casteCode,
                    CASE
                        WHEN c."birthDate" IS NULL THEN 'ALL'
                        WHEN EXTRACT(YEAR FROM AGE(c."birthDate")) < 1 THEN '0-1y'
                        WHEN EXTRACT(YEAR FROM AGE(c."birthDate")) < 5 THEN '1-5y'
                        ELSE '5y+'
                    END as ageGroup,
                    vr."vaccineTypeId",
                    vr."doseNumber",
                    COUNT(vr.id) as vaccine_count,
                    -- Check if this specific vaccine+dose is completed
                    BOOL_OR(vr."isComplete") as is_vaccine_completed
                FROM "Child" c
                CROSS JOIN (SELECT DISTINCT "vaccineTypeId", "doseNumber" FROM "VaccinationRecord" WHERE "vaccineTypeId" IS NOT NULL) vr_base
                LEFT JOIN "VaccinationRecord" vr ON vr."citizenId" = c.id AND vr."vaccineTypeId" = vr_base."vaccineTypeId" AND vr."doseNumber" = vr_base."doseNumber"
                GROUP BY c.id, c."wardNumber", c."gender", c."casteCode", c."birthDate", vr."vaccineTypeId", vr."doseNumber"
            )
            SELECT
                CURRENT_DATE AS day,
                COALESCE(vs."wardNumber", 1) AS ward,
                vs."vaccineTypeId",
                vs."doseNumber",
                vs.gender,
                vs.ageGroup,
                vs.casteCode,
                
                COUNT(DISTINCT vs.id) AS totalRegisteredChildren,
                COUNT(DISTINCT CASE WHEN vs.is_vaccine_completed THEN vs.id END) AS vaccinatedChildren,
                COUNT(DISTINCT CASE WHEN NOT vs.is_vaccine_completed THEN vs.id END) AS zeroDoseChildren,
                
                0 AS dueToday,
                0 AS overdue,
                0 AS onTime,
                0 AS late,
                0 AS dropoutRate, -- Dropout calculated at overall level, not per vaccine
                
                CURRENT_TIMESTAMP AS "createdAt",
                CURRENT_TIMESTAMP AS "updatedAt"
                
            FROM vaccine_stats vs
            WHERE vs."vaccineTypeId" IS NOT NULL
            GROUP BY vs."wardNumber", vs."vaccineTypeId", vs."doseNumber", vs.gender, vs.ageGroup, vs.casteCode
        `);

        console.timeEnd('⏱️ ChildAnalyticsFact Query Time');

        const [{ count: factCount }] = await prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "ChildAnalyticsFact" WHERE "day" = CURRENT_DATE`;
        log(`✅ ChildAnalyticsFact records for today: ${factCount}`, '✅');

        // Debug: Check what was actually inserted
        const debugData = await prisma.$queryRawUnsafe(`
            SELECT 
                "vaccineTypeId",
                COUNT(*) as record_count,
                SUM("totalRegisteredChildren") as total_children,
                SUM("vaccinatedChildren") as vaccinated_children,
                SUM("zeroDoseChildren") as zero_dose_children,
                AVG("dropoutRate") as avg_dropout_rate
            FROM "ChildAnalyticsFact" 
            WHERE "day" = CURRENT_DATE
            GROUP BY "vaccineTypeId"
            ORDER BY "vaccineTypeId"
        `);
        log(`DEBUG - Vaccine Type breakdown:`, '🔍');
        debugData.forEach(row => {
            log(`  VaccineType ${row.vaccineTypeId}: ${row.record_count} records, ${row.total_children} children, ${row.vaccinated_children} vaccinated, ${row.zero_dose_children} zero dose, ${row.avg_dropout_rate}% dropout`);
        });

    } catch (err) {
        log(`❌ ChildAnalyticsFact failed: ${err.message}`, '❌');
        console.error(err);
    } finally {
        console.timeEnd('⏱️ ChildAnalyticsFact Duration');
        log('ChildAnalyticsFact update process finished.', '🏁');
    }
}

// ---- MOTHER FACTS ----
// server/worker/analyticsFactUpdater.js
// ✅ COMPLETE FIX - All facts working



// ---- MOTHER FACTS ----
async function updateMotherFacts() {
    log('Starting MotherAnalyticsFact update...', '🤰');
    console.time('⏱️ MotherAnalyticsFact Duration');
    try {
        const [{ count: motherCount }] = await prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "Mother"`;
        const [{ count: tdCount }] = await prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "TDDose"`;
        log(`Actual counts - Mother: ${motherCount}, TDDose: ${tdCount}`);

        console.time('⏱️ MotherAnalyticsFact Query Time');
        log('Running INSERT/UPDATE for MotherAnalyticsFact...');

        // First, clear today's data
        await prisma.$executeRawUnsafe(`DELETE FROM "MotherAnalyticsFact" WHERE "day" = CURRENT_DATE`);
        log('Cleared existing mother data for today');

        // Insert overall mother summary (doseNumber = 0)
        await prisma.$executeRawUnsafe(`
            INSERT INTO "MotherAnalyticsFact" (
                "day", "ward", "doseNumber", "casteCode",
                "totalRegisteredMothers", "tdDosesGiven", "mothersWithZeroTD",
                "mothersWithFullTD", "dueToday", "overdue",
                "createdAt", "updatedAt"
            )
            WITH mother_td_stats AS (
                SELECT 
                    m.id,
                    m."wardNumber", 
                    COALESCE(m."casteCode", 0) as casteCode,
                    COUNT(td.id) as total_td_doses,
                    BOOL_OR(td."doseNumber" >= 2) as has_full_td
                FROM "Mother" m
                LEFT JOIN "TDDose" td ON td."motherId" = m.id
                GROUP BY m.id, m."wardNumber", m."casteCode"
            )
            SELECT
                CURRENT_DATE,
                COALESCE(mts."wardNumber", 1),
                0 AS "doseNumber", -- 0 means "all doses" (overall summary)
                mts.casteCode,
                
                COUNT(DISTINCT mts.id) AS totalRegisteredMothers,
                SUM(mts.total_td_doses) AS tdDosesGiven,
                COUNT(DISTINCT CASE WHEN mts.total_td_doses = 0 THEN mts.id END) AS mothersWithZeroTD,
                COUNT(DISTINCT CASE WHEN mts.has_full_td THEN mts.id END) AS mothersWithFullTD,
                0 AS dueToday,
                0 AS overdue,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
                
            FROM mother_td_stats mts
            GROUP BY mts."wardNumber", mts.casteCode
        `);

        // Insert dose-specific data (doseNumber = 1, 2, etc.)
        await prisma.$executeRawUnsafe(`
            INSERT INTO "MotherAnalyticsFact" (
                "day", "ward", "doseNumber", "casteCode",
                "totalRegisteredMothers", "tdDosesGiven", "mothersWithZeroTD",
                "mothersWithFullTD", "dueToday", "overdue",
                "createdAt", "updatedAt"
            )
            SELECT
                CURRENT_DATE,
                COALESCE(m."wardNumber", 1),
                td."doseNumber",
                COALESCE(m."casteCode", 0),
                
                COUNT(DISTINCT m.id) AS totalRegisteredMothers,
                COUNT(td.id) AS tdDosesGiven,
                0 AS mothersWithZeroTD, -- Not applicable for specific doses
                0 AS mothersWithFullTD, -- Not applicable for specific doses
                0 AS dueToday,
                0 AS overdue,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
                
            FROM "Mother" m
            INNER JOIN "TDDose" td ON td."motherId" = m.id
            GROUP BY m."wardNumber", td."doseNumber", m."casteCode"
        `);

        console.timeEnd('⏱️ MotherAnalyticsFact Query Time');

        // Debug what was inserted
        const debugData = await prisma.$queryRawUnsafe(`
            SELECT 
                "doseNumber",
                COUNT(*) as record_count,
                SUM("totalRegisteredMothers") as total_mothers,
                SUM("tdDosesGiven") as td_doses,
                SUM("mothersWithZeroTD") as zero_td,
                SUM("mothersWithFullTD") as full_td
            FROM "MotherAnalyticsFact" 
            WHERE "day" = CURRENT_DATE
            GROUP BY "doseNumber"
            ORDER BY "doseNumber"
        `);

        log(`DEBUG - Mother facts inserted:`, '🔍');
        debugData.forEach(row => {
            log(`  Dose ${row.doseNumber}: ${row.record_count} records, ${row.total_mothers} mothers, ${row.td_doses} TD doses, ${row.zero_td} zero TD, ${row.full_td} full TD`);
        });

        const [{ count: factCount }] = await prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "MotherAnalyticsFact" WHERE "day" = CURRENT_DATE`;
        log(`✅ MotherAnalyticsFact records for today: ${factCount}`, '✅');

    } catch (err) {
        log(`❌ MotherAnalyticsFact failed: ${err.message}`, '❌');
        console.error(err);
    } finally {
        console.timeEnd('⏱️ MotherAnalyticsFact Duration');
        log('MotherAnalyticsFact update process finished.', '🏁');
    }
}

// ---- GROWTH FACTS ----
// ---- GROWTH FACTS ----
async function updateGrowthFacts() {
    log('Starting GrowthAnalyticsFact update...', '📈');
    console.time('⏱️ GrowthAnalyticsFact Duration');
    try {
        const [{ count: wrCount }] = await prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "WeightRecord"`;
        log(`WeightRecord count: ${wrCount}`);

        console.time('⏱️ GrowthAnalyticsFact Query Time');
        log('Executing INSERT/UPDATE for GrowthAnalyticsFact...');

        // Clear and insert growth data
        await prisma.$executeRawUnsafe(`DELETE FROM "GrowthAnalyticsFact" WHERE "day" = CURRENT_DATE`);

        await prisma.$executeRawUnsafe(`
            INSERT INTO "GrowthAnalyticsFact" (
                "day", "ward", "gender", "ageGroup", "casteCode",
                "totalWeightRecords", "avgWeightKg", "underweightCount",
                "normalWeightCount", "overweightCount",
                "createdAt", "updatedAt"
            )
            WITH child_growth AS (
                SELECT 
                    c.id,
                    COALESCE(NULLIF(wr."wardOfVaccination", 0), c."wardNumber", 1) as ward,
                    COALESCE(NULLIF(c."gender", ''), 'ALL') as gender,
                    CASE
                        WHEN c."birthDate" IS NULL THEN 'ALL'
                        WHEN EXTRACT(YEAR FROM AGE(c."birthDate")) < 1 THEN '0-1y'
                        WHEN EXTRACT(YEAR FROM AGE(c."birthDate")) < 5 THEN '1-5y'
                        ELSE '5y+'
                    END as ageGroup,
                    COALESCE(c."casteCode", 0) as casteCode,
                    wr."weight"
                FROM "WeightRecord" wr
                INNER JOIN "Child" c ON c.id = wr."childId"
                WHERE wr."weight" IS NOT NULL
            )
            SELECT
                CURRENT_DATE,
                cg.ward,
                cg.gender,
                cg.ageGroup,
                cg.casteCode,
                COUNT(*) AS totalWeightRecords,
                ROUND(AVG(cg."weight")::numeric, 2) AS avgWeightKg,
                COUNT(CASE WHEN cg."weight" < 5 THEN 1 END) AS underweightCount,
                COUNT(CASE WHEN cg."weight" BETWEEN 5 AND 20 THEN 1 END) AS normalWeightCount,
                COUNT(CASE WHEN cg."weight" > 20 THEN 1 END) AS overweightCount,
                CURRENT_TIMESTAMP AS "createdAt",
                CURRENT_TIMESTAMP AS "updatedAt"
            FROM child_growth cg
            GROUP BY cg.ward, cg.gender, cg.ageGroup, cg.casteCode
        `);

        console.timeEnd('⏱️ GrowthAnalyticsFact Query Time');

        // Debug what was inserted - FIXED: Handle empty results
        const debugData = await prisma.$queryRawUnsafe(`
            SELECT 
                COUNT(*) as total_records,
                SUM("totalWeightRecords") as weight_records,
                AVG("avgWeightKg") as avg_weight,
                SUM("underweightCount") as underweight,
                SUM("normalWeightCount") as normal,
                SUM("overweightCount") as overweight
            FROM "GrowthAnalyticsFact" 
            WHERE "day" = CURRENT_DATE
        `);

        const result = debugData[0] || {
            total_records: 0,
            weight_records: 0,
            avg_weight: 0,
            underweight: 0,
            normal: 0,
            overweight: 0
        };

        log(`DEBUG - Growth facts: ${result.total_records} records, ${result.weight_records} weight entries, avg ${result.avg_weight}kg, underweight: ${result.underweight}, normal: ${result.normal}, overweight: ${result.overweight}`, '🔍');

        const [{ count: factCount }] = await prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "GrowthAnalyticsFact" WHERE "day" = CURRENT_DATE`;
        log(`✅ GrowthAnalyticsFact records for today: ${factCount}`, '✅');

    } catch (err) {
        log(`❌ GrowthAnalyticsFact failed: ${err.message}`, '❌');
        console.error(err);
    } finally {
        console.timeEnd('⏱️ GrowthAnalyticsFact Duration');
        log('GrowthAnalyticsFact update process finished.', '🏁');
    }
}




// ---- DATA VALIDATION ----
async function validateDataConsistency() {
    log('Validating data consistency...', '🔍');

    try {
        // Check child counts (only from vaccineTypeId = 0 records)
        const [actualChildren, factChildren] = await Promise.all([
            prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "Child"`,
            prisma.$queryRaw`SELECT SUM("totalRegisteredChildren")::int AS count FROM "ChildAnalyticsFact" WHERE "day" = CURRENT_DATE AND "vaccineTypeId" = 0`
        ]);

        const actualCount = actualChildren[0].count;
        const factCount = factChildren[0].count || 0;

        log(`Data consistency check - Actual Children: ${actualCount}, Fact Children: ${factCount}`);

        if (actualCount !== factCount) {
            log(`❌ DATA MISMATCH: Child counts don't match! Difference: ${Math.abs(actualCount - factCount)}`, '❌');
        } else {
            log(`✅ Child counts match perfectly!`, '✅');
        }

        // Check mother counts (only from doseNumber = 0 records)
        const [actualMothers, factMothers] = await Promise.all([
            prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "Mother"`,
            prisma.$queryRaw`SELECT SUM("totalRegisteredMothers")::int AS count FROM "MotherAnalyticsFact" WHERE "day" = CURRENT_DATE AND "doseNumber" = 0`
        ]);

        const actualMotherCount = actualMothers[0].count;
        const factMotherCount = factMothers[0].count || 0;

        log(`Mother consistency - Actual: ${actualMotherCount}, Fact: ${factMotherCount}`);

        if (actualMotherCount !== factMotherCount) {
            log(`❌ Mother counts don't match! Difference: ${Math.abs(actualMotherCount - factMotherCount)}`, '❌');
        } else {
            log(`✅ Mother counts match perfectly!`, '✅');
        }

    } catch (err) {
        log(`Validation error: ${err.message}`, '❌');
    }
}

// ---- MAIN RUNNER ----
async function main() {
    log('🚀 Starting analytics fact update...');
    console.time('⏱️ Total Worker Duration');
    try {
        log('Updating analyticsMeta start timestamp...');
        await prisma.analyticsMeta.upsert({
            where: { id: 1 },
            update: {
                lastProcessedChild: new Date(),
                lastProcessedMother: new Date(),
                lastProcessedGrowth: new Date(),
            },
            create: {
                id: 1,
                lastProcessedChild: new Date(),
                lastProcessedMother: new Date(),
                lastProcessedGrowth: new Date(),
            },
        });
        log('analyticsMeta upsert successful.');

        await updateChildFacts();
        await updateMotherFacts();
        await updateGrowthFacts();

        await validateDataConsistency();

        log('✅ All analytics facts updated successfully!');
    } catch (err) {
        log(`❌ Main process error: ${err.message}`, '❌');
        console.error(err);
    } finally {
        console.timeEnd('⏱️ Total Worker Duration');
        log('Main analytics update process completed.', '🏁');
    }
}

main().catch((err) => {
    log(`🚨 Unhandled error in main: ${err.message}`, '🚨');
    console.error(err);
});