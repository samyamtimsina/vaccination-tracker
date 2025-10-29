import { prisma } from '../utils/prisma.js';

/* ---------------------------
   Logger helper
--------------------------- */
function log(msg, symbol = 'ℹ️') {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${symbol} ${msg}`);
}

/* ---------------------------
   Helpers: changed wards detection
   Uses updatedAt on relevant tables
--------------------------- */
async function getChangedWards(lastProcessedChild, lastProcessedMother, lastProcessedGrowth) {
  log('🔍 Checking for changed wards...');

  const meta = await prisma.analyticsMeta.findFirst();
  if (!meta) {
    log('No AnalyticsMeta found');
    return [];
  }

  console.log('=== DEBUG RAW SQL APPROACH ===');

  // Format timestamp for direct SQL insertion (bypass Prisma parameter handling)
  const formatTimestampForSQL = (date) => {
    return date.toISOString().replace('T', ' ').replace('Z', '');
  };

  const childTimeSQL = formatTimestampForSQL(meta.lastProcessedChild);
  const motherTimeSQL = formatTimestampForSQL(meta.lastProcessedMother);
  const growthTimeSQL = formatTimestampForSQL(meta.lastProcessedGrowth);

  console.log('Child time for SQL:', childTimeSQL);

  try {
    // Use unsafe raw SQL with direct string interpolation
    const updatedChildren = await prisma.$queryRawUnsafe(`
      SELECT DISTINCT COALESCE("wardNumber", 1)::int AS ward
      FROM "Child"
      WHERE "updatedAt" > '${childTimeSQL}'
    `);

    console.log('Children with updates (raw SQL):', updatedChildren);

    // If we get results, proceed with all tables using the same approach
    if (updatedChildren.length > 0) {
      const [
        updatedVaccinations,
        updatedMothers,
        updatedTDDoses,
        updatedWeights,
      ] = await Promise.all([
        prisma.$queryRawUnsafe(`
          SELECT DISTINCT COALESCE("wardOfVaccination", COALESCE(c."wardNumber", 1))::int AS ward
          FROM "VaccinationRecord" vr
          LEFT JOIN "Child" c ON c.id = vr."citizenId"
          WHERE vr."updatedAt" > '${childTimeSQL}'
        `),

        prisma.$queryRawUnsafe(`
          SELECT DISTINCT COALESCE("wardNumber", 1)::int AS ward
          FROM "Mother"
          WHERE "updatedAt" > '${childTimeSQL}'
        `),

        prisma.$queryRawUnsafe(`
          SELECT DISTINCT COALESCE(m."wardNumber", 1)::int AS ward
          FROM "TDDose" td
          JOIN "Mother" m ON m.id = td."motherId"
          WHERE td."updatedAt" > '${childTimeSQL}'
        `),

        prisma.$queryRawUnsafe(`
          SELECT DISTINCT COALESCE(NULLIF(wr."wardOfVaccination", 0), COALESCE(c."wardNumber", 1))::int AS ward
          FROM "WeightRecord" wr
          LEFT JOIN "Child" c ON c.id = wr."childId"
          WHERE wr."updatedAt" > '${childTimeSQL}'
        `)
      ]);

      // Merge results
      const set = new Set();
      [updatedChildren, updatedVaccinations, updatedMothers, updatedTDDoses, updatedWeights].forEach(arr => {
        if (!arr) return;
        arr.forEach(r => {
          const w = r.ward;
          if (w !== null && w !== undefined) set.add(Number(w));
        });
      });

      const list = Array.from(set).filter(w => Number.isFinite(w)).sort((a, b) => a - b);
      log(`🧩 Changed wards since last run: ${list.length ? list.join(', ') : 'none'}`);
      return list;
    } else {
      console.log('No changes detected with raw SQL approach either');
      return [];
    }

  } catch (error) {
    console.error('Error in raw SQL detection:', error);
    return [];
  }
}

/* ---------------------------
   Utility: SQL-safe ward list
   returns string like '(1,2,3)' or null if empty
--------------------------- */
function toSqlWardList(wards) {
  if (!wards || wards.length === 0) return null;
  // Ensure integers
  const nums = Array.from(new Set(wards.map(w => Number(w)).filter(n => Number.isFinite(n))));
  if (nums.length === 0) return null;
  return `(${nums.join(',')})`;
}

/* =================================================
   CHILD - per-ward incremental insert (WITH FIXED DEMOGRAPHIC OVERDUE)
   ================================================= */
async function updateChildFactsForWards(wardList) {
  if (!wardList || wardList.length === 0) {
    log('No child/vaccination changes detected for incremental run. Skipping Child facts.');
    return;
  }
  const wardSql = toSqlWardList(wardList);
  if (!wardSql) return;

  log(`🧒 Updating ChildAnalyticsFact for wards ${wardSql} ...`);

  // detect backdated vaccination edits in those wards
  const backdatedRows = await prisma.$queryRawUnsafe(`
    SELECT 1 FROM "VaccinationRecord" vr
    LEFT JOIN "Child" c ON c.id = vr."citizenId"
    WHERE vr."updatedAt" > (SELECT LEAST(
          COALESCE((SELECT "lastProcessedChild" FROM "AnalyticsMeta" LIMIT 1), '1970-01-01'::timestamp),
          COALESCE((SELECT "lastProcessedMother" FROM "AnalyticsMeta" LIMIT 1), '1970-01-01'::timestamp)
        ))
      AND DATE(vr."dateGiven") < CURRENT_DATE
      AND COALESCE(vr."wardOfVaccination", COALESCE(c."wardNumber", 1)) IN ${wardSql}
    LIMIT 1;
  `);

  if (backdatedRows && backdatedRows.length) {
    log('⚠️ Backdated vaccination edits detected in affected wards (dateGiven < today).', '⚠️');
  }

  // delete today's rows for those wards
  await prisma.$executeRawUnsafe(`
    DELETE FROM "ChildAnalyticsFact"
    WHERE "day" = CURRENT_DATE
      AND "ward" IN ${wardSql};
  `);
  log('Deleted existing ChildAnalyticsFact rows for affected wards (today).');

  // overall per-ward child summary scoped to wards WITH ELIGIBILITY
  await prisma.$executeRawUnsafe(`
    INSERT INTO "ChildAnalyticsFact" (
      "day","ward","vaccineTypeId","doseNumber","gender","ageGroup","casteCode",
      "totalRegisteredChildren","vaccinatedChildren","zeroDoseChildren",
      "dueToday","overdue","onTime","late","dropoutRate","createdAt","updatedAt"
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
        -- Count only eligible vaccinations (due vaccines that are past due date)
        EXISTS (
          SELECT 1 FROM "ChildDueVaccine" cdv
          WHERE cdv."childId" = c.id 
            AND cdv."dueDate" <= CURRENT_DATE 
            AND cdv."isCompleted" = true
        ) AS is_vaccinated,
        (SELECT COUNT(*) FROM "ChildDueVaccine" cdv
          WHERE cdv."childId" = c.id AND cdv."dueDate" = CURRENT_DATE AND cdv."isCompleted" = false
        ) AS due_today,
        -- FIXED: Count actual overdue children (not doses) per demographic group
        CASE WHEN EXISTS (
          SELECT 1 FROM "ChildDueVaccine" cdv
          WHERE cdv."childId" = c.id
            AND cdv."dueDate" < CURRENT_DATE
            AND cdv."isCompleted" = false
        ) THEN 1 ELSE 0 END AS overdue_count
      FROM "Child" c
      WHERE COALESCE(c."wardNumber", 1) IN ${wardSql}
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
  log('✅ Overall child facts inserted.');

  // FIXED: per-vaccine rows with PROPER per-child-per-vaccine logic
  await prisma.$executeRawUnsafe(`
    WITH active_vaccine_types AS (
      SELECT DISTINCT vr."vaccineTypeId"
      FROM "VaccinationRecord" vr
      JOIN "Child" c ON c.id = vr."citizenId"
      WHERE COALESCE(vr."wardOfVaccination", COALESCE(c."wardNumber", 1)) IN ${wardSql}
        AND vr."vaccineTypeId" IS NOT NULL
    ),
    all_children AS (
      SELECT 
        c.id,
        COALESCE(c."wardNumber", 1) AS ward
      FROM "Child" c
      WHERE COALESCE(c."wardNumber", 1) IN ${wardSql}
    ),
    eligible_vaccinations AS (
      SELECT 
        ac.id AS child_id,
        ac.ward,
        avt."vaccineTypeId",
        -- FIX: Vaccinated if AT LEAST ONE eligible dose is completed
        EXISTS(
          SELECT 1 FROM "ChildDueVaccine" cdv
          WHERE cdv."childId" = ac.id 
            AND cdv."vaccineTypeId" = avt."vaccineTypeId"
            AND cdv."dueDate" <= CURRENT_DATE
            AND cdv."isCompleted" = true
        ) AS is_vaccinated,
        -- FIX: Zero-dose if eligible but NO doses completed
        EXISTS(
          SELECT 1 FROM "ChildDueVaccine" cdv
          WHERE cdv."childId" = ac.id 
            AND cdv."vaccineTypeId" = avt."vaccineTypeId"
            AND cdv."dueDate" <= CURRENT_DATE
        ) AND NOT EXISTS(
          SELECT 1 FROM "ChildDueVaccine" cdv
          WHERE cdv."childId" = ac.id 
            AND cdv."vaccineTypeId" = avt."vaccineTypeId"
            AND cdv."dueDate" <= CURRENT_DATE
            AND cdv."isCompleted" = true
        ) AS is_zero_dose,
        -- Eligible if any due vaccine exists
        EXISTS(
          SELECT 1 FROM "ChildDueVaccine" cdv
          WHERE cdv."childId" = ac.id 
            AND cdv."vaccineTypeId" = avt."vaccineTypeId"
            AND cdv."dueDate" <= CURRENT_DATE
        ) AS is_eligible
      FROM all_children ac
      CROSS JOIN active_vaccine_types avt
    )
    INSERT INTO "ChildAnalyticsFact" (
      "day","ward","vaccineTypeId","doseNumber","gender","ageGroup","casteCode",
      "totalRegisteredChildren","vaccinatedChildren","zeroDoseChildren",
      "dueToday","overdue","onTime","late","dropoutRate","createdAt","updatedAt"
    )
    SELECT
      CURRENT_DATE,
      ev.ward,
      ev."vaccineTypeId",
      0 AS "doseNumber",
      'ALL' AS gender,
      'ALL' AS ageGroup,
      0 AS casteCode,
      -- Count only ELIGIBLE children as denominator
      COUNT(DISTINCT CASE WHEN ev.is_eligible THEN ev.child_id END) AS totalRegisteredChildren,
      COUNT(DISTINCT CASE WHEN ev.is_vaccinated THEN ev.child_id END) AS vaccinatedChildren,
      COUNT(DISTINCT CASE WHEN ev.is_zero_dose THEN ev.child_id END) AS zeroDoseChildren,
      0, 0, 0, 0, 0,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    FROM eligible_vaccinations ev
    GROUP BY ev.ward, ev."vaccineTypeId";
  `);
  log('✅ Per-vaccine eligible child facts inserted.');

  // FIXED: Calculate ACTUAL overdue children per demographic group
  await prisma.$executeRawUnsafe(`
    -- Calculate ACTUAL overdue children per demographic group
    UPDATE "ChildAnalyticsFact" caf
    SET "overdue" = sub.demographic_overdue
    FROM (
      SELECT
        COALESCE(c."wardNumber", 1) AS ward,
        COALESCE(NULLIF(c."gender", ''), 'ALL') AS gender,
        CASE
          WHEN c."birthDate" IS NULL THEN 'ALL'
          WHEN EXTRACT(YEAR FROM AGE(c."birthDate")) < 1 THEN '0-1y'
          WHEN EXTRACT(YEAR FROM AGE(c."birthDate")) < 5 THEN '1-5y'
          ELSE '5y+'
        END AS ageGroup,
        COALESCE(c."casteCode", 0) AS casteCode,
        COUNT(DISTINCT c.id) AS demographic_overdue
      FROM "Child" c
      WHERE EXISTS (
        SELECT 1 FROM "ChildDueVaccine" cdv
        WHERE cdv."childId" = c.id
          AND cdv."dueDate" < CURRENT_DATE
          AND cdv."isCompleted" = false
      )
      AND COALESCE(c."wardNumber", 1) IN ${wardSql}
      GROUP BY 
        COALESCE(c."wardNumber", 1),
        COALESCE(NULLIF(c."gender", ''), 'ALL'),
        CASE
          WHEN c."birthDate" IS NULL THEN 'ALL'
          WHEN EXTRACT(YEAR FROM AGE(c."birthDate")) < 1 THEN '0-1y'
          WHEN EXTRACT(YEAR FROM AGE(c."birthDate")) < 5 THEN '1-5y'
          ELSE '5y+'
        END,
        COALESCE(c."casteCode", 0)
    ) sub
    WHERE caf."ward" = sub.ward
      AND caf."gender" = sub.gender
      AND caf."ageGroup" = sub.ageGroup
      AND caf."casteCode" = sub.casteCode
      AND caf."vaccineTypeId" = 0 
      AND caf."day" = CURRENT_DATE;
  `);
  log('✅ Overdue counts fixed to maintain demographic breakdown.');

  // dropout per vaccine (multi-primary vaccines) scoped to wards WITH ELIGIBILITY
  await prisma.$executeRawUnsafe(`
    WITH eligible_vaccines AS (
      SELECT "vaccineTypeId"
      FROM "Dose"
      WHERE "isPrimary" = true
      GROUP BY "vaccineTypeId"
      HAVING COUNT(*) > 1
    ),
    dose_bounds AS (
      SELECT d."vaccineTypeId", MIN(d."doseNumber") AS first_dose_no, MAX(d."doseNumber") AS last_dose_no
      FROM "Dose" d
      JOIN eligible_vaccines ev ON ev."vaccineTypeId" = d."vaccineTypeId"
      WHERE d."isPrimary" = true
      GROUP BY d."vaccineTypeId"
    ),
    eligible_dose_counts AS (
      SELECT
        vr."vaccineTypeId",
        COALESCE(vr."wardOfVaccination", COALESCE(c."wardNumber", 1)) AS ward,
        -- Only count doses where child was eligible (due date has passed)
        COUNT(DISTINCT CASE 
          WHEN vr."doseNumber" = db.first_dose_no AND vr."isComplete" = true
          AND EXISTS (
            SELECT 1 FROM "ChildDueVaccine" cdv 
            WHERE cdv."childId" = vr."citizenId" 
              AND cdv."vaccineTypeId" = vr."vaccineTypeId" 
              AND cdv."doseNumber" = db.first_dose_no
              AND cdv."dueDate" <= CURRENT_DATE
          )
          THEN vr."citizenId" 
        END) AS first_dose,
        COUNT(DISTINCT CASE 
          WHEN vr."doseNumber" = db.last_dose_no AND vr."isComplete" = true
          AND EXISTS (
            SELECT 1 FROM "ChildDueVaccine" cdv 
            WHERE cdv."childId" = vr."citizenId" 
              AND cdv."vaccineTypeId" = vr."vaccineTypeId" 
              AND cdv."doseNumber" = db.last_dose_no
              AND cdv."dueDate" <= CURRENT_DATE
          )
          THEN vr."citizenId" 
        END) AS last_dose
      FROM "VaccinationRecord" vr
      JOIN "Child" c ON c.id = vr."citizenId"
      JOIN dose_bounds db ON db."vaccineTypeId" = vr."vaccineTypeId"
      WHERE COALESCE(vr."wardOfVaccination", COALESCE(c."wardNumber", 1)) IN ${wardSql}
      GROUP BY vr."vaccineTypeId", COALESCE(vr."wardOfVaccination", COALESCE(c."wardNumber", 1))
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
      FROM eligible_dose_counts
    )
    UPDATE "ChildAnalyticsFact" caf
    SET "dropoutRate" = dc.dropout_rate
    FROM dropout_calc dc
    WHERE caf."ward" = dc.ward
      AND caf."vaccineTypeId" = dc."vaccineTypeId"
      AND caf."doseNumber" = 0
      AND caf."day" = CURRENT_DATE;
  `);
  log('✅ Dropout rates updated for multi-dose vaccines.');

  log('🟢 ChildFacts fully reprocessed for affected wards.');
}

/* =================================================
   MOTHER - per-ward incremental reprocessing
   ================================================= */
async function updateMotherFactsForWards(wardList) {
  if (!wardList || wardList.length === 0) {
    log('No mother/td changes detected for incremental run. Skipping Mother facts.');
    return;
  }
  const wardSql = toSqlWardList(wardList);
  if (!wardSql) return;

  log(`🤰 Updating MotherAnalyticsFact for wards ${wardSql} ...`);

  // backdated detection
  const backdated = await prisma.$queryRawUnsafe(`
    SELECT 1 FROM "TDDose" td
    JOIN "Mother" m ON m.id = td."motherId"
    WHERE td."updatedAt" > (SELECT COALESCE("lastProcessedMother", '1970-01-01'::timestamp) FROM "AnalyticsMeta" LIMIT 1)
      AND DATE(td."dateGiven") < CURRENT_DATE
      AND COALESCE(m."wardNumber", 1) IN ${wardSql}
    LIMIT 1;
  `);

  if (backdated && backdated.length) {
    log('⚠️ Backdated TD edits detected in affected wards (dateGiven < today).', '⚠️');
  }

  // delete today's mother facts for these wards
  await prisma.$executeRawUnsafe(`
    DELETE FROM "MotherAnalyticsFact"
    WHERE "day" = CURRENT_DATE
      AND "ward" IN ${wardSql};
  `);
  log('Deleted existing MotherAnalyticsFact rows for affected wards (today).');

  // re-insert overall summary scoped to wards
  await prisma.$executeRawUnsafe(`
    WITH mother_td_status AS (
      SELECT
        m.id,
        COALESCE(m."wardNumber", 1) AS ward,
        COALESCE(m."casteCode", 0) AS casteCode,
        COUNT(td.id) AS total_td_doses,
        MAX(td."doseNumber") AS highest_dose
      FROM "Mother" m
      LEFT JOIN "TDDose" td ON td."motherId" = m.id
      WHERE COALESCE(m."wardNumber", 1) IN ${wardSql}
      GROUP BY m.id, m."wardNumber", m."casteCode"
    ),
    aggregated AS (
      SELECT
        ward, casteCode,
        COUNT(*) AS totalRegisteredMothers,
        SUM(total_td_doses) AS tdDosesGiven,
        COUNT(CASE WHEN total_td_doses = 0 THEN 1 END) AS mothersWithZeroTD,
        COUNT(CASE WHEN highest_dose >= 2 THEN 1 END) AS mothersWithFullTD
      FROM mother_td_status
      GROUP BY ward, casteCode
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

  // per-dose breakdown scoped to wards
  await prisma.$executeRawUnsafe(`
    INSERT INTO "MotherAnalyticsFact" (
      "day","ward","doseNumber","casteCode",
      "totalRegisteredMothers","tdDosesGiven","mothersWithZeroTD",
      "mothersWithFullTD","dueToday","overdue","createdAt","updatedAt"
    )
    SELECT
      CURRENT_DATE,
      COALESCE(m."wardNumber", 1),
      td."doseNumber",
      COALESCE(m."casteCode", 0),
      COUNT(DISTINCT m.id) AS totalRegisteredMothers,
      COUNT(td.id) AS tdDosesGiven,
      0, 0, 0, 0,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    FROM "Mother" m
    INNER JOIN "TDDose" td ON td."motherId" = m.id
    WHERE COALESCE(m."wardNumber", 1) IN ${wardSql}
    GROUP BY COALESCE(m."wardNumber", 1), td."doseNumber", m."casteCode";
  `);

  log('✅ MotherFacts reprocessed for affected wards.');
}

/* =================================================
   GROWTH - per-ward incremental reprocessing
   ================================================= */
async function updateGrowthFactsForWards(wardList) {
  if (!wardList || wardList.length === 0) {
    log('No growth/weight changes detected for incremental run. Skipping Growth facts.');
    return;
  }
  const wardSql = toSqlWardList(wardList);
  if (!wardSql) return;

  log(`📈 Updating GrowthAnalyticsFact for wards ${wardSql} ...`);

  // backdated detection
  const backdated = await prisma.$queryRawUnsafe(`
    SELECT 1 FROM "WeightRecord" wr
    LEFT JOIN "Child" c ON c.id = wr."childId"
    WHERE wr."updatedAt" > (SELECT COALESCE("lastProcessedGrowth", '1970-01-01'::timestamp) FROM "AnalyticsMeta" LIMIT 1)
      AND DATE(wr."date") < CURRENT_DATE
      AND COALESCE(NULLIF(wr."wardOfVaccination", 0), COALESCE(c."wardNumber", 1)) IN ${wardSql}
    LIMIT 1;
  `);

  if (backdated && backdated.length) {
    log('⚠️ Backdated weight edits detected in affected wards (date < today).', '⚠️');
  }

  // delete today's growth facts for these wards
  await prisma.$executeRawUnsafe(`
    DELETE FROM "GrowthAnalyticsFact"
    WHERE "day" = CURRENT_DATE
      AND "ward" IN ${wardSql};
  `);
  log('Deleted existing GrowthAnalyticsFact rows for affected wards (today).');

  // insert aggregated growth facts scoped to wards
  await prisma.$executeRawUnsafe(`
    WITH child_growth AS (
      SELECT
        COALESCE(NULLIF(wr."wardOfVaccination", 0), COALESCE(c."wardNumber", 1)) AS ward,
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
        AND COALESCE(NULLIF(wr."wardOfVaccination", 0), COALESCE(c."wardNumber", 1)) IN ${wardSql}
    ),
    aggregated AS (
      SELECT ward, gender, ageGroup, casteCode,
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
    SELECT CURRENT_DATE, ward, gender, ageGroup, casteCode,
           totalWeightRecords, avgWeightKg, underweightCount,
           normalWeightCount, overweightCount,
           CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    FROM aggregated;
  `);

  log('✅ GrowthFacts reprocessed for affected wards.');
}

/* =================================================
   Data consistency & quality validation (always prints full report)
   ================================================= */
async function validateDataQuality() {
  log('🔍 Running full data quality & consistency validation (full report)...');

  try {
    // Child counts
    const [actualChildren, factChildren] = await Promise.all([
      prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "Child"`,
      prisma.$queryRaw`SELECT COALESCE(SUM("totalRegisteredChildren"),0)::int AS count FROM "ChildAnalyticsFact" WHERE "day" = CURRENT_DATE AND "vaccineTypeId" = 0`
    ]);
    const actualCount = actualChildren[0].count ?? 0;
    const factCount = factChildren[0].count ?? 0;
    log(`Children - actual: ${actualCount}, facts (vaccineTypeId=0): ${factCount}`);

    if (actualCount !== factCount) {
      log(`❌ Child count mismatch: diff=${actualCount - factCount}`, '❌');
    } else {
      log('✅ Child counts match perfectly!');
    }

    // Mother counts
    const [actualMothers, factMothers] = await Promise.all([
      prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "Mother"`,
      prisma.$queryRaw`SELECT COALESCE(SUM("totalRegisteredMothers"),0)::int AS count FROM "MotherAnalyticsFact" WHERE "day" = CURRENT_DATE AND "doseNumber" = 0`
    ]);
    const actualM = actualMothers[0].count ?? 0;
    const factM = factMothers[0].count ?? 0;
    log(`Mothers - actual: ${actualM}, facts (doseNumber=0): ${factM}`);
    if (actualM !== factM) {
      log(`❌ Mother count mismatch: diff=${actualM - factM}`, '❌');
    } else {
      log('✅ Mother counts match perfectly!');
    }

    // Growth record counts
    const [actualWeights, factWeights] = await Promise.all([
      prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "WeightRecord"`,
      prisma.$queryRaw`SELECT COALESCE(SUM("totalWeightRecords"),0)::int AS count FROM "GrowthAnalyticsFact" WHERE "day" = CURRENT_DATE`
    ]);
    const actualW = actualWeights[0].count ?? 0;
    const factW = factWeights[0].count ?? 0;
    log(`WeightRecords - actual: ${actualW}, facts (totalWeightRecords sum): ${factW}`);
    if (actualW !== factW) {
      log(`❌ WeightRecord mismatch: diff=${actualW - factW}`, '❌');
    } else {
      log('✅ Growth records match perfectly (sum of daily totals).');
    }

    // Vaccine per-dose consistency check WITH ELIGIBILITY FILTERING
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
      eligible_dose_counts AS (
        SELECT 
          vr."vaccineTypeId",
          vt.name AS vaccine_name,
          COUNT(DISTINCT CASE 
            WHEN vr."doseNumber" = db.first_dose_no AND vr."isComplete" = true
            AND EXISTS (
              SELECT 1 FROM "ChildDueVaccine" cdv 
              WHERE cdv."childId" = vr."citizenId" 
                AND cdv."vaccineTypeId" = vr."vaccineTypeId" 
                AND cdv."doseNumber" = db.first_dose_no
                AND cdv."dueDate" <= CURRENT_DATE
            )
            THEN vr."citizenId" 
          END) AS first_dose,
          COUNT(DISTINCT CASE 
            WHEN vr."doseNumber" = db.last_dose_no AND vr."isComplete" = true
            AND EXISTS (
              SELECT 1 FROM "ChildDueVaccine" cdv 
              WHERE cdv."childId" = vr."citizenId" 
                AND cdv."vaccineTypeId" = vr."vaccineTypeId" 
                AND cdv."doseNumber" = db.last_dose_no
                AND cdv."dueDate" <= CURRENT_DATE
            )
            THEN vr."citizenId" 
          END) AS last_dose
        FROM "VaccinationRecord" vr
        JOIN dose_bounds db ON db."vaccineTypeId" = vr."vaccineTypeId"
        JOIN "VaccineType" vt ON vt.id = vr."vaccineTypeId"
        GROUP BY vr."vaccineTypeId", vt.name
      )
      SELECT vaccine_name, first_dose, last_dose,
        CASE WHEN last_dose > first_dose THEN 'DATA_ISSUE' ELSE 'OK' END AS status
      FROM eligible_dose_counts;
    `;

    if (!dataQualityCheck || dataQualityCheck.length === 0) {
      log('✅ Vaccine dose consistency: no vaccine-specific issues found.');
    } else {
      log('🔎 Vaccine dose consistency report (all vaccines):');
      dataQualityCheck.forEach(row => {
        log(`- ${row.vaccine_name}: first=${row.first_dose}, last=${row.last_dose}, status=${row.status}`);
      });
    }

    // NEW: Overdue validation to ensure demographic breakdown is correct
    const overdueValidation = await prisma.$queryRaw`
      SELECT 
        SUM("totalRegisteredChildren") AS total_children,
        SUM("overdue") AS overdue_children,
        ROUND((SUM("overdue")::decimal / NULLIF(SUM("totalRegisteredChildren"), 0) * 100), 2) AS overdue_pct
      FROM "ChildAnalyticsFact" 
      WHERE "vaccineTypeId" = 0 AND "day" = CURRENT_DATE;
    `;

    if (overdueValidation && overdueValidation.length > 0) {
      const val = overdueValidation[0];
      log(`📊 Overdue validation - Total: ${val.total_children}, Overdue: ${val.overdue_children} (${val.overdue_pct}%)`);

      // Check demographic distribution
      const demographicOverdue = await prisma.$queryRaw`
        SELECT 
          "gender", 
          "ageGroup",
          SUM("totalRegisteredChildren") AS total,
          SUM("overdue") AS overdue,
          ROUND((SUM("overdue")::decimal / NULLIF(SUM("totalRegisteredChildren"), 0) * 100), 2) AS overdue_pct
        FROM "ChildAnalyticsFact"
        WHERE "vaccineTypeId" = 0 AND "day" = CURRENT_DATE
        GROUP BY "gender", "ageGroup"
        ORDER BY "gender", "ageGroup";
      `;

      log('📈 Demographic overdue distribution:');
      demographicOverdue.forEach(row => {
        log(`- ${row.gender}/${row.ageGroup}: ${row.overdue}/${row.total} (${row.overdue_pct}%)`);
      });
    }

  } catch (err) {
    log(`❌ Validation query failed: ${err.message}`, '❌');
    console.error(err);
  }
}

/* =================================================
   MAIN incremental runner with first-run full rebuild
   ================================================= */
async function main() {
  log('🚀 Starting incremental analytics update...');
  console.time('TotalWorkerDuration');

  try {
    // ensure AnalyticsMeta row exists
    let meta = await prisma.analyticsMeta.findFirst();
    if (!meta) {
      log('🆕 AnalyticsMeta missing — creating default entry...');
      meta = await prisma.analyticsMeta.create({
        data: {
          lastProcessedChild: new Date(0),
          lastProcessedMother: new Date(0),
          lastProcessedGrowth: new Date(0),
        },
      });
    }

    // detect timestamps (use epoch-zero fallback)
    const lastChild = meta.lastProcessedChild ?? new Date(0);
    const lastMother = meta.lastProcessedMother ?? new Date(0);
    const lastGrowth = meta.lastProcessedGrowth ?? new Date(0);

    const isFirstRun = (!meta.lastProcessedChild && !meta.lastProcessedMother && !meta.lastProcessedGrowth)
      || (lastChild.getTime() === 0 && lastMother.getTime() === 0 && lastGrowth.getTime() === 0);
    if (isFirstRun) {
      log('🆕 First-ever analytics run detected — will perform full rebuild (all wards).');
    }

    // get changed wards
    let changedWards = await getChangedWards(lastChild, lastMother, lastGrowth);

    // first-run fallback: if no changed wards detected but it's first run, rebuild all wards
    if (isFirstRun && (!changedWards || changedWards.length === 0)) {
      log('🔄 First run fallback: rebuilding all wards...');
      // get all wards from Child table
      const allWards = await prisma.$queryRaw`SELECT DISTINCT COALESCE("wardNumber", 1)::int AS ward FROM "Child" ORDER BY 1`;
      changedWards = allWards.map(r => Number(r.ward));
    }

    // run incremental updates for changed wards
    await updateChildFactsForWards(changedWards);
    await updateMotherFactsForWards(changedWards);
    await updateGrowthFactsForWards(changedWards);

    // update last processed timestamps
    const now = new Date();
    await prisma.analyticsMeta.updateMany({
      data: {
        lastProcessedChild: now,
        lastProcessedMother: now,
        lastProcessedGrowth: now,
      },
    });
    log('✅ Updated AnalyticsMeta timestamps.');

    // always run validation
    await validateDataQuality();

    console.timeEnd('TotalWorkerDuration');
    log('✅ Incremental analytics update completed successfully!');
  } catch (error) {
    console.error('❌ Analytics update failed:', error);
    throw error;
  }
}

main().catch(err => {
  log(`🚨 Unhandled error in worker: ${err.message}`, '🚨');
  console.error(err);
});