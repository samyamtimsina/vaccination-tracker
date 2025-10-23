// server/worker/analyticsFactUpdater.js
// ✅ FINAL FIX - Proper counts and vaccine-specific data

import { prisma } from '../utils/prisma.js';

// ---- Utility logger ----
function log(msg, symbol = 'ℹ️') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${symbol} ${msg}`);
}

async function updateChildFacts() {
    log('Starting ChildAnalyticsFact update (optimized)...', '🧒');
    console.time('⏱️ ChildAnalyticsFact Duration');

    try {
        log('Counting base tables...');
        const [{ count: childCount }] = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS count FROM "Child"
    `;
        const [{ count: vaxCount }] = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS count FROM "VaccinationRecord" WHERE "isComplete" = true
    `;
        log(`Counts → Child: ${childCount}, Completed Vaccinations: ${vaxCount}`);

        await prisma.$executeRawUnsafe(`
      DELETE FROM "ChildAnalyticsFact" WHERE "day" = CURRENT_DATE;
    `);
        log('Cleared existing ChildAnalyticsFact data for today.');

        console.time('⏱️ ChildAnalyticsFact Insert Time');

        // 👶 STEP 2️⃣: Insert overall per-ward child summary
        await prisma.$executeRawUnsafe(`
      INSERT INTO "ChildAnalyticsFact" (
        "day", "ward", "vaccineTypeId", "doseNumber",
        "gender", "ageGroup", "casteCode",
        "totalRegisteredChildren", "vaccinatedChildren",
        "zeroDoseChildren", "dueToday", "overdue",
        "onTime", "late", "dropoutRate",
        "createdAt", "updatedAt"
      )
      WITH child_stats AS (
        SELECT 
          c.id,
          COALESCE(c."wardNumber", 1) AS ward,
          COALESCE(NULLIF(c."gender", ''), 'ALL') AS gender,
          COALESCE(c."casteCode", 0) AS casteCode,
          CASE
            WHEN c."birthDate" IS NULL THEN 'ALL'
            WHEN EXTRACT(YEAR FROM AGE(c."birthDate")) < 1 THEN '0-1y'
            WHEN EXTRACT(YEAR FROM AGE(c."birthDate")) < 5 THEN '1-5y'
            ELSE '5y+'
          END AS ageGroup,
          EXISTS (
            SELECT 1 FROM "VaccinationRecord" vr 
            WHERE vr."citizenId" = c.id AND vr."isComplete" = true
          ) AS is_vaccinated,
          (SELECT COUNT(*) FROM "ChildDueVaccine" cdv 
            WHERE cdv."childId" = c.id AND cdv."dueDate" = CURRENT_DATE AND cdv."isCompleted" = false
          ) AS due_today,
          (SELECT COUNT(*) FROM "ChildDueVaccine" cdv 
            WHERE cdv."childId" = c.id AND cdv."dueDate" < CURRENT_DATE AND cdv."isCompleted" = false
          ) AS overdue_count
        FROM "Child" c
      )
      SELECT
        CURRENT_DATE,
        cs.ward,
        0 AS "vaccineTypeId",
        0 AS "doseNumber",
        cs.gender,
        cs.ageGroup,
        cs.casteCode,
        COUNT(cs.id) AS totalRegisteredChildren,
        COUNT(*) FILTER (WHERE cs.is_vaccinated) AS vaccinatedChildren,
        COUNT(*) FILTER (WHERE NOT cs.is_vaccinated) AS zeroDoseChildren,
        SUM(cs.due_today) AS dueToday,
        SUM(cs.overdue_count) AS overdue,
        0, 0, 0,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      FROM child_stats cs
      GROUP BY cs.ward, cs.gender, cs.ageGroup, cs.casteCode;
    `);

        // 🧩 STEP 3.5️⃣: Insert per-vaccine summary
        await prisma.$executeRawUnsafe(`
      INSERT INTO "ChildAnalyticsFact" (
        "day", "ward", "vaccineTypeId", "doseNumber",
        "gender", "ageGroup", "casteCode",
        "totalRegisteredChildren", "vaccinatedChildren",
        "zeroDoseChildren", "dueToday", "overdue",
        "onTime", "late", "dropoutRate",
        "createdAt", "updatedAt"
      )
      SELECT
        CURRENT_DATE,
        COALESCE(vr."wardOfVaccination", 1) AS ward,
        vr."vaccineTypeId",
        0 AS "doseNumber",
        'ALL' AS gender,
        'ALL' AS ageGroup,
        0 AS casteCode,
        COUNT(DISTINCT c.id) AS totalRegisteredChildren,
        COUNT(DISTINCT CASE WHEN vr."isComplete" THEN c.id END) AS vaccinatedChildren,
        COUNT(DISTINCT CASE WHEN NOT vr."isComplete" THEN c.id END) AS zeroDoseChildren,
        0, 0, 0, 0, 0,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      FROM "VaccinationRecord" vr
      JOIN "Child" c ON c.id = vr."citizenId"
      WHERE vr."vaccineTypeId" IS NOT NULL
      GROUP BY COALESCE(vr."wardOfVaccination", 1), vr."vaccineTypeId";
    `);

        log('✅ Inserted per-vaccine summary rows.');

        // 📉 STEP 4️⃣: Compute dropout per vaccine type (only for multi-primary-dose vaccines)
        log('Calculating dropout rates per vaccine type (multi-dose only)...', '📉');
        await prisma.$executeRawUnsafe(`
      WITH eligible_vaccines AS (
        SELECT "vaccineTypeId"
        FROM "Dose"
        WHERE "isPrimary" = true
        GROUP BY "vaccineTypeId"
        HAVING COUNT(*) > 1
      ),
      dose_bounds AS (
        SELECT 
          d."vaccineTypeId",
          MIN(d."doseNumber") AS first_dose_no,
          MAX(d."doseNumber") AS last_dose_no
        FROM "Dose" d
        JOIN eligible_vaccines ev ON ev."vaccineTypeId" = d."vaccineTypeId"
        WHERE d."isPrimary" = true
        GROUP BY d."vaccineTypeId"
      ),
      dose_counts AS (
        SELECT 
          vr."vaccineTypeId",
          COALESCE(vr."wardOfVaccination", 1) AS ward,
          COUNT(DISTINCT CASE WHEN vr."doseNumber" = db.first_dose_no AND vr."isComplete" = true THEN vr."citizenId" END) AS first_dose,
          COUNT(DISTINCT CASE WHEN vr."doseNumber" = db.last_dose_no AND vr."isComplete" = true THEN vr."citizenId" END) AS last_dose
        FROM "VaccinationRecord" vr
        JOIN dose_bounds db ON db."vaccineTypeId" = vr."vaccineTypeId"
        GROUP BY vr."vaccineTypeId", COALESCE(vr."wardOfVaccination", 1)
      ),
      dropout_calc AS (
        SELECT
          "vaccineTypeId",
          ward,
          first_dose,
          last_dose,
          CASE 
            WHEN first_dose = 0 THEN 0
            WHEN last_dose > first_dose THEN 0
            ELSE ROUND((1.0 - (last_dose::numeric / NULLIF(first_dose, 0))) * 100, 2)
          END AS dropout_rate
        FROM dose_counts
      )
      UPDATE "ChildAnalyticsFact" caf
      SET "dropoutRate" = dc.dropout_rate
      FROM dropout_calc dc
      WHERE caf."ward" = dc.ward
        AND caf."vaccineTypeId" = dc."vaccineTypeId"
        AND caf."doseNumber" = 0
        AND caf."day" = CURRENT_DATE;
    `);

        log('✅ Dropout rates computed successfully.');

        // 🧾 STEP 5️⃣: Validate data quality
        const dataQualityCheck = await prisma.$queryRaw`
      WITH eligible_vaccines AS (
        SELECT "vaccineTypeId"
        FROM "Dose"
        WHERE "isPrimary" = true
        GROUP BY "vaccineTypeId"
        HAVING COUNT(*) > 1
      ),
      dose_bounds AS (
        SELECT 
          d."vaccineTypeId",
          MIN(d."doseNumber") AS first_dose_no,
          MAX(d."doseNumber") AS last_dose_no
        FROM "Dose" d
        JOIN eligible_vaccines ev ON ev."vaccineTypeId" = d."vaccineTypeId"
        WHERE d."isPrimary" = true
        GROUP BY d."vaccineTypeId"
      ),
      dose_counts AS (
        SELECT 
          vr."vaccineTypeId",
          vt.name AS vaccine_name,
          COUNT(DISTINCT CASE WHEN vr."doseNumber" = db.first_dose_no AND vr."isComplete" = true THEN vr."citizenId" END) AS first_dose,
          COUNT(DISTINCT CASE WHEN vr."doseNumber" = db.last_dose_no AND vr."isComplete" = true THEN vr."citizenId" END) AS last_dose
        FROM "VaccinationRecord" vr
        JOIN dose_bounds db ON db."vaccineTypeId" = vr."vaccineTypeId"
        JOIN "VaccineType" vt ON vt.id = vr."vaccineTypeId"
        GROUP BY vr."vaccineTypeId", vt.name
      )
      SELECT vaccine_name, first_dose, last_dose,
        CASE WHEN last_dose > first_dose THEN 'DATA_ISSUE' ELSE 'OK' END AS status
      FROM dose_counts
      WHERE last_dose > first_dose;
    `;

        if (dataQualityCheck.length > 0) {
            log(`⚠️ Data quality issues found:`, '⚠️');
            dataQualityCheck.forEach(issue => {
                log(`Vaccine: ${issue.vaccine_name}, First: ${issue.first_dose}, Last: ${issue.last_dose}`, '⚠️');
            });
        }

        const [{ count: factCount }] = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS count FROM "ChildAnalyticsFact" WHERE "day" = CURRENT_DATE
    `;
        log(`✅ ChildAnalyticsFact rows for today: ${factCount}`, '✅');

    } catch (err) {
        log(`❌ ChildAnalyticsFact update failed: ${err.message}`, '❌');
        console.error(err);
    } finally {
        console.timeEnd('⏱️ ChildAnalyticsFact Duration');
        log('🏁 ChildAnalyticsFact update finished.');
    }
}

// ---- MOTHER FACTS (Optimized) ----
async function updateMotherFacts() {
    log('Starting MotherAnalyticsFact update (optimized)...', '🤰');
    console.time('⏱️ MotherAnalyticsFact Duration');

    try {
        const [{ count: motherCount }] = await prisma.$queryRaw`
            SELECT COUNT(*)::int AS count FROM "Mother"
        `;
        const [{ count: tdCount }] = await prisma.$queryRaw`
            SELECT COUNT(*)::int AS count FROM "TDDose"
        `;
        log(`Counts → Mother: ${motherCount}, TDDose: ${tdCount}`);

        // Clear today's facts
        await prisma.$executeRawUnsafe(`DELETE FROM "MotherAnalyticsFact" WHERE "day" = CURRENT_DATE`);
        log('Cleared existing MotherAnalyticsFact data for today.');

        console.time('⏱️ MotherAnalyticsFact Insert Time');

        // 1️⃣ Overall summary (doseNumber = 0)
        await prisma.$executeRawUnsafe(`
            WITH mother_td_status AS (
                SELECT
                    m.id,
                    m."wardNumber",
                    COALESCE(m."casteCode", 0) AS casteCode,
                    COUNT(td.id) AS total_td_doses,
                    MAX(td."doseNumber") AS highest_dose
                FROM "Mother" m
                LEFT JOIN "TDDose" td ON td."motherId" = m.id
                GROUP BY m.id, m."wardNumber", m."casteCode"
            ),
            aggregated AS (
                SELECT
                COALESCE("wardNumber", 0) AS ward,
COALESCE(casteCode, 0) AS casteCode,

                    COUNT(*) AS totalRegisteredMothers,
                    SUM(total_td_doses) AS tdDosesGiven,
                    COUNT(CASE WHEN total_td_doses = 0 THEN 1 END) AS mothersWithZeroTD,
                    COUNT(CASE WHEN highest_dose >= 2 THEN 1 END) AS mothersWithFullTD
                FROM mother_td_status
                GROUP BY "wardNumber", casteCode
            )
            INSERT INTO "MotherAnalyticsFact" (
                "day","ward","doseNumber","casteCode",
                "totalRegisteredMothers","tdDosesGiven","mothersWithZeroTD",
                "mothersWithFullTD","dueToday","overdue","createdAt","updatedAt"
            )
            SELECT
                CURRENT_DATE, ward, 0, casteCode,
                totalRegisteredMothers, tdDosesGiven, mothersWithZeroTD,
                mothersWithFullTD, 0, 0,
                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM aggregated;
        `);

        // 2️⃣ Per-dose breakdown (doseNumber > 0)
        await prisma.$executeRawUnsafe(`
            INSERT INTO "MotherAnalyticsFact" (
                "day","ward","doseNumber","casteCode",
                "totalRegisteredMothers","tdDosesGiven","mothersWithZeroTD",
                "mothersWithFullTD","dueToday","overdue","createdAt","updatedAt"
            )
            SELECT
                CURRENT_DATE,
                m."wardNumber",
                td."doseNumber",
                COALESCE(m."casteCode", 0),
                COUNT(DISTINCT m.id) AS totalRegisteredMothers,
                COUNT(td.id) AS tdDosesGiven,
                0, 0, 0, 0,
                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM "Mother" m
            INNER JOIN "TDDose" td ON td."motherId" = m.id
            GROUP BY m."wardNumber", td."doseNumber", m."casteCode";
        `);

        console.timeEnd('⏱️ MotherAnalyticsFact Insert Time');

        const [{ count: factCount }] = await prisma.$queryRaw`
            SELECT COUNT(*)::int AS count FROM "MotherAnalyticsFact" WHERE "day" = CURRENT_DATE
        `;
        log(`✅ MotherAnalyticsFact rows for today: ${factCount}`, '✅');

    } catch (err) {
        log(`❌ MotherAnalyticsFact update failed: ${err.message}`, '❌');
        console.error(err);
    } finally {
        console.timeEnd('⏱️ MotherAnalyticsFact Duration');
        log('MotherAnalyticsFact update finished.', '🏁');
    }
}


// ---- GROWTH FACTS (Optimized) ----
async function updateGrowthFacts() {
    log('Starting GrowthAnalyticsFact update (optimized)...', '📈');
    console.time('⏱️ GrowthAnalyticsFact Duration');

    try {
        const [{ count: wrCount }] = await prisma.$queryRaw`
            SELECT COUNT(*)::int AS count FROM "WeightRecord"
        `;
        log(`WeightRecord count: ${wrCount}`);

        await prisma.$executeRawUnsafe(`DELETE FROM "GrowthAnalyticsFact" WHERE "day" = CURRENT_DATE`);
        log('Cleared existing GrowthAnalyticsFact data for today.');

        console.time('⏱️ GrowthAnalyticsFact Insert Time');

        await prisma.$executeRawUnsafe(`
            WITH child_growth AS (
                SELECT 
                    COALESCE(NULLIF(wr."wardOfVaccination", 0), c."wardNumber", 1) AS ward,
                    COALESCE(NULLIF(c."gender", ''), 'ALL') AS gender,
                    CASE
                        WHEN c."birthDate" IS NULL THEN 'ALL'
                        WHEN EXTRACT(YEAR FROM AGE(c."birthDate")) < 1 THEN '0-1y'
                        WHEN EXTRACT(YEAR FROM AGE(c."birthDate")) < 5 THEN '1-5y'
                        ELSE '5y+'
                    END AS ageGroup,
                    COALESCE(c."casteCode", 0) AS casteCode,
                    wr."weight"
                FROM "WeightRecord" wr
                INNER JOIN "Child" c ON c.id = wr."childId"
                WHERE wr."weight" IS NOT NULL
            ),
            aggregated AS (
                SELECT
                    ward, gender, ageGroup, casteCode,
                    COUNT(*) AS totalWeightRecords,
                    ROUND(AVG(weight)::numeric, 2) AS avgWeightKg,
                    COUNT(CASE WHEN weight < 5 THEN 1 END) AS underweightCount,
                    COUNT(CASE WHEN weight BETWEEN 5 AND 20 THEN 1 END) AS normalWeightCount,
                    COUNT(CASE WHEN weight > 20 THEN 1 END) AS overweightCount
                FROM child_growth
                GROUP BY ward, gender, ageGroup, casteCode
            )
            INSERT INTO "GrowthAnalyticsFact" (
                "day","ward","gender","ageGroup","casteCode",
                "totalWeightRecords","avgWeightKg","underweightCount",
                "normalWeightCount","overweightCount","createdAt","updatedAt"
            )
            SELECT
                CURRENT_DATE, ward, gender, ageGroup, casteCode,
                totalWeightRecords, avgWeightKg, underweightCount,
                normalWeightCount, overweightCount,
                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM aggregated;
        `);

        console.timeEnd('⏱️ GrowthAnalyticsFact Insert Time');

        const [{ count: factCount }] = await prisma.$queryRaw`
            SELECT COUNT(*)::int AS count FROM "GrowthAnalyticsFact" WHERE "day" = CURRENT_DATE
        `;
        log(`✅ GrowthAnalyticsFact rows for today: ${factCount}`, '✅');

    } catch (err) {
        log(`❌ GrowthAnalyticsFact update failed: ${err.message}`, '❌');
        console.error(err);
    } finally {
        console.timeEnd('⏱️ GrowthAnalyticsFact Duration');
        log('GrowthAnalyticsFact update finished.', '🏁');
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