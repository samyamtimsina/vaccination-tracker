import { prisma } from '../utils/prisma.js';
import { format, subMonths, endOfMonth, startOfMonth } from 'date-fns';

/* ---------------------------
   Logger helper
--------------------------- */
function log(msg, symbol = 'ℹ️') {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${symbol} ${msg}`);
}

/* ---------------------------
   Helpers: changed wards detection
   Returns separate ward lists for each fact type
--------------------------- */
async function getChangedWards(lastProcessedChild, lastProcessedMother, lastProcessedGrowth) {
  log('🔍 Checking for changed wards by entity type...');

  // If no timestamps provided (first run), use epoch
  const childTime = lastProcessedChild || new Date(0);
  const motherTime = lastProcessedMother || new Date(0);
  const growthTime = lastProcessedGrowth || new Date(0);

  const formatTimestampForSQL = (date) => {
    return date.toISOString().replace('T', ' ').replace('Z', '');
  };

  const childTimeSQL = formatTimestampForSQL(childTime);
  const motherTimeSQL = formatTimestampForSQL(motherTime);
  const growthTimeSQL = formatTimestampForSQL(growthTime);

  try {
    // Check for child-related changes (Child + VaccinationRecord)
    const [updatedChildren, updatedVaccinations] = await Promise.all([
      prisma.$queryRawUnsafe(`
        SELECT DISTINCT COALESCE("wardNumber", 1)::int AS ward
        FROM "Child"
        WHERE "updatedAt" > '${childTimeSQL}'
      `),
      prisma.$queryRawUnsafe(`
        SELECT DISTINCT COALESCE("wardOfVaccination", COALESCE(c."wardNumber", 1))::int AS ward
        FROM "VaccinationRecord" vr
        LEFT JOIN "Child" c ON c.id = vr."citizenId"
        WHERE vr."updatedAt" > '${childTimeSQL}'
      `)
    ]);

    // Check for mother-related changes (Mother + TDDose)
    const [updatedMothers, updatedTDDoses] = await Promise.all([
      prisma.$queryRawUnsafe(`
        SELECT DISTINCT COALESCE("wardNumber", 1)::int AS ward
        FROM "Mother"
        WHERE "updatedAt" > '${motherTimeSQL}'
      `),
      prisma.$queryRawUnsafe(`
        SELECT DISTINCT COALESCE(m."wardNumber", 1)::int AS ward
        FROM "TDDose" td
        JOIN "Mother" m ON m.id = td."motherId"
        WHERE td."updatedAt" > '${motherTimeSQL}'
      `)
    ]);

    // Check for growth-related changes (WeightRecord)
    const updatedWeights = await prisma.$queryRawUnsafe(`
      SELECT DISTINCT COALESCE(NULLIF(wr."wardOfVaccination", 0), COALESCE(c."wardNumber", 1))::int AS ward
      FROM "WeightRecord" wr
      LEFT JOIN "Child" c ON c.id = wr."childId"
      WHERE wr."updatedAt" > '${growthTimeSQL}'
    `);

    // Create separate sets for each fact type
    const childWardSet = new Set();
    const motherWardSet = new Set();
    const growthWardSet = new Set();

    // Populate child wards (Child + VaccinationRecord)
    [updatedChildren, updatedVaccinations].forEach(arr => {
      if (!arr) return;
      arr.forEach(r => {
        const w = r.ward;
        if (w !== null && w !== undefined) childWardSet.add(Number(w));
      });
    });

    // Populate mother wards (Mother + TDDose)
    [updatedMothers, updatedTDDoses].forEach(arr => {
      if (!arr) return;
      arr.forEach(r => {
        const w = r.ward;
        if (w !== null && w !== undefined) motherWardSet.add(Number(w));
      });
    });

    // Populate growth wards (WeightRecord)
    if (updatedWeights) {
      updatedWeights.forEach(r => {
        const w = r.ward;
        if (w !== null && w !== undefined) growthWardSet.add(Number(w));
      });
    }

    // Convert to sorted arrays
    const childWards = Array.from(childWardSet).filter(w => Number.isFinite(w)).sort((a, b) => a - b);
    const motherWards = Array.from(motherWardSet).filter(w => Number.isFinite(w)).sort((a, b) => a - b);
    const growthWards = Array.from(growthWardSet).filter(w => Number.isFinite(w)).sort((a, b) => a - b);

    log(`🧒 Child-related wards: ${childWards.length ? childWards.join(', ') : 'none'}`);
    log(`🤰 Mother-related wards: ${motherWards.length ? motherWards.join(', ') : 'none'}`);
    log(`📈 Growth-related wards: ${growthWards.length ? growthWards.join(', ') : 'none'}`);

    return {
      childWards,
      motherWards,
      growthWards
    };

  } catch (error) {
    console.error('Error in changed wards detection:', error);
    return { childWards: [], motherWards: [], growthWards: [] };
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

  // --- backdated detection ---
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

  // --- delete today's mother facts ---
  await prisma.$executeRawUnsafe(`
    DELETE FROM "MotherAnalyticsFact"
    WHERE "day" = CURRENT_DATE
      AND "ward" IN ${wardSql};
  `);
  log('Deleted existing MotherAnalyticsFact rows for today.');

  // --- overall summary with coverage/dropoutRate ---
  await prisma.$executeRawUnsafe(`
    INSERT INTO "MotherAnalyticsFact" (
      "day","ward","doseNumber","casteCode",
      "totalRegisteredMothers","tdDosesGiven","mothersWithZeroTD","mothersWithFullTD",
      "dueToday","overdue","coverage","dropoutRate","createdAt","updatedAt"
    )
    WITH mother_stats AS (
      SELECT
        m.id,
        COALESCE(m."wardNumber", 1) AS ward,
        COALESCE(m."casteCode", 0) AS casteCode,
        COUNT(td.id) AS td_doses_count,
        MAX(td."doseNumber") AS max_dose
      FROM "Mother" m
      LEFT JOIN "TDDose" td ON td."motherId" = m.id
      WHERE COALESCE(m."wardNumber", 1) IN ${wardSql}
      GROUP BY m.id, COALESCE(m."wardNumber", 1), COALESCE(m."casteCode", 0)
    )
    SELECT
      CURRENT_DATE,
      ms.ward,
      0 AS "doseNumber",
      ms.casteCode,
      COUNT(ms.id) AS totalRegisteredMothers,
      SUM(ms.td_doses_count) AS tdDosesGiven,
      COUNT(*) FILTER (WHERE ms.td_doses_count = 0) AS mothersWithZeroTD,
      COUNT(*) FILTER (WHERE ms.max_dose >= 2) AS mothersWithFullTD,
      0, 0, 0, 0,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    FROM mother_stats ms
    GROUP BY ms.ward, ms.casteCode;
  `);
  log('✅ Overall mother facts inserted.');

  // --- per-dose rows ---
  await prisma.$executeRawUnsafe(`
    INSERT INTO "MotherAnalyticsFact" (
      "day","ward","doseNumber","casteCode",
      "totalRegisteredMothers","tdDosesGiven","mothersWithZeroTD","mothersWithFullTD",
      "dueToday","overdue","coverage","dropoutRate","createdAt","updatedAt"
    )
    WITH dose_counts AS (
      SELECT
        COALESCE(m."wardNumber", 1) AS ward,
        COALESCE(m."casteCode", 0) AS casteCode,
        td."doseNumber",
        COUNT(td.id) AS dose_count,
        COUNT(DISTINCT m.id) AS mothers_count
      FROM "Mother" m
      JOIN "TDDose" td ON td."motherId" = m.id
      WHERE COALESCE(m."wardNumber", 1) IN ${wardSql}
      GROUP BY COALESCE(m."wardNumber", 1), COALESCE(m."casteCode", 0), td."doseNumber"
    )
    SELECT
      CURRENT_DATE,
      dc.ward,
      dc."doseNumber",
      dc.casteCode,
      dc.mothers_count AS totalRegisteredMothers,
      dc.dose_count AS tdDosesGiven,
      0, 0, 0, 0, 0, 0,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    FROM dose_counts dc;
  `);
  log('✅ Per-dose mother facts inserted.');

  // --- coverage ---
  await prisma.$executeRawUnsafe(`
    UPDATE "MotherAnalyticsFact" maf
    SET "coverage" = ROUND(
      (maf."tdDosesGiven"::numeric / NULLIF(maf."totalRegisteredMothers", 0)) * 100,
      2
    )
    WHERE maf."day" = CURRENT_DATE
      AND maf."ward" IN ${wardSql};
  `);
  log('✅ Mother coverage updated.');

  // --- dropoutRate (for dose 1 -> dose 2) ---
  await prisma.$executeRawUnsafe(`
    WITH dose_counts AS (
      SELECT
        COALESCE(m."wardNumber", 1) AS ward,
        COALESCE(m."casteCode", 0) AS casteCode,
        COUNT(DISTINCT CASE WHEN td."doseNumber" = 1 THEN m.id END) AS dose1_mothers,
        COUNT(DISTINCT CASE WHEN td."doseNumber" = 2 THEN m.id END) AS dose2_mothers
      FROM "Mother" m
      LEFT JOIN "TDDose" td ON td."motherId" = m.id
      WHERE COALESCE(m."wardNumber", 1) IN ${wardSql}
      GROUP BY COALESCE(m."wardNumber", 1), COALESCE(m."casteCode", 0)
    ),
    dropout_calc AS (
      SELECT
        ward,
        casteCode,
        CASE
          WHEN dose1_mothers = 0 THEN 0
          WHEN dose2_mothers > dose1_mothers THEN 0
          ELSE ROUND((1.0 - (dose2_mothers::numeric / NULLIF(dose1_mothers, 0))) * 100, 2)
        END AS dropout_rate
      FROM dose_counts
    )
    UPDATE "MotherAnalyticsFact" maf
    SET "dropoutRate" = dc.dropout_rate
    FROM dropout_calc dc
    WHERE maf."ward" = dc.ward
      AND maf."casteCode" = dc.casteCode
      AND maf."doseNumber" = 0
      AND maf."day" = CURRENT_DATE;
  `);
  log('✅ Mother dropout rates updated.');

  log('🟢 MotherFacts fully reprocessed for affected wards.');
}

/* =================================================
   GROWTH - per-ward incremental reprocessing
   ================================================= */
async function updateGrowthFactsForWards(wardList) {
  if (!wardList || wardList.length === 0) {
    log('No growth changes detected for incremental run. Skipping Growth facts.');
    return;
  }
  const wardSql = toSqlWardList(wardList);
  if (!wardSql) return;

  log(`📈 Updating GrowthAnalyticsFact for wards ${wardSql} ...`);

  // --- delete today's growth facts ---
  await prisma.$executeRawUnsafe(`
    DELETE FROM "GrowthAnalyticsFact"
    WHERE "day" = CURRENT_DATE
      AND "ward" IN ${wardSql};
  `);
  log('Deleted existing GrowthAnalyticsFact rows for today.');

  // --- insert growth facts ---
  await prisma.$executeRawUnsafe(`
    INSERT INTO "GrowthAnalyticsFact" (
      "day","ward","gender","ageGroup","casteCode",
      "totalWeightRecords","avgWeightKg","underweightCount","normalWeightCount","overweightCount",
      "createdAt","updatedAt"
    )
    WITH growth_stats AS (
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
        wr.weight,
        CASE
          WHEN wr.weight < 2.5 THEN 'underweight'
          WHEN wr.weight <= 4.0 THEN 'normal'
          ELSE 'overweight'
        END AS weight_category
      FROM "WeightRecord" wr
      LEFT JOIN "Child" c ON c.id = wr."childId"
      WHERE COALESCE(NULLIF(wr."wardOfVaccination", 0), COALESCE(c."wardNumber", 1)) IN ${wardSql}
    )
    SELECT
      CURRENT_DATE,
      gs.ward,
      gs.gender,
      gs.ageGroup,
      gs.casteCode,
      COUNT(*) AS totalWeightRecords,
      -- FIX: Cast to numeric before rounding
      ROUND(AVG(gs.weight)::numeric, 2) AS avgWeightKg,
      COUNT(*) FILTER (WHERE gs.weight_category = 'underweight') AS underweightCount,
      COUNT(*) FILTER (WHERE gs.weight_category = 'normal') AS normalWeightCount,
      COUNT(*) FILTER (WHERE gs.weight_category = 'overweight') AS overweightCount,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    FROM growth_stats gs
    GROUP BY gs.ward, gs.gender, gs.ageGroup, gs.casteCode;
  `);
  log('🟢 GrowthFacts fully reprocessed for affected wards.');
}

/* =================================================
   CHILD MONTHLY DROPOUT - Snapshot-based with 30-day window (Immutable for past months)
   ================================================= */
async function updateChildMonthlyDropoutForWards(wardList) {
  if (!wardList || wardList.length === 0) {
    log('No child changes detected. Skipping Monthly Dropout facts.');
    return;
  }
  const wardSql = toSqlWardList(wardList);
  if (!wardSql) return;

  log(`📉 Updating ChildMonthlyDropoutFact for wards ${wardSql} ...`);

  // No DELETE - we preserve history

  // Step 1: Insert for past months (last 12, excluding current) - only if missing (ON CONFLICT DO NOTHING)
  await prisma.$executeRawUnsafe(`
    INSERT INTO "ChildMonthlyDropoutFact" (
      "snapshotMonth", "ward", "vaccineTypeId", "doseNumber", "gender", "ageGroup", "casteCode",
      "totalDue", "totalCompleted", "dropoutCount", "dropoutRate", "createdAt", "updatedAt"
    )
    WITH snapshots AS (
      SELECT generate_series(
        DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months'),
        DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'),
        '1 month'::interval
      )::date AS snapshot_month
    ),
    dropout_stats AS (
      SELECT
        s.snapshot_month,
        COALESCE(c."wardNumber", 1) AS ward,
        cdv."vaccineTypeId",
        cdv."doseNumber",
        COALESCE(NULLIF(c."gender", ''), 'ALL') AS gender,
        CASE
          WHEN c."birthDate" IS NULL THEN 'ALL'
          WHEN EXTRACT(YEAR FROM AGE(s.snapshot_month, c."birthDate")) < 1 THEN '0-1y'
          WHEN EXTRACT(YEAR FROM AGE(s.snapshot_month, c."birthDate")) < 5 THEN '1-5y'
          ELSE '5y+'
        END AS ageGroup,
        COALESCE(c."casteCode", 0) AS casteCode,
        cdv."childId",
        (s.snapshot_month + INTERVAL '1 month - 1 day')::date AS snapshot_end,
        CASE WHEN cdv."dueDate" < (s.snapshot_month - INTERVAL '30 days') THEN 1 ELSE 0 END AS is_due,
        CASE WHEN vr."dateGiven" IS NOT NULL AND vr."dateGiven" <= (s.snapshot_month + INTERVAL '1 month - 1 day') THEN 1 ELSE 0 END AS is_completed,
        CASE WHEN cdv."dueDate" < (s.snapshot_month - INTERVAL '30 days')
          AND (vr."dateGiven" IS NULL OR vr."dateGiven" > (s.snapshot_month + INTERVAL '1 month - 1 day')) THEN 1 ELSE 0 END AS is_dropout
      FROM snapshots s
      CROSS JOIN "ChildDueVaccine" cdv
      JOIN "Child" c ON c.id = cdv."childId"
      LEFT JOIN "VaccinationRecord" vr ON vr."citizenId" = cdv."childId"
        AND vr."vaccineTypeId" = cdv."vaccineTypeId"
        AND vr."doseNumber" = cdv."doseNumber"
      WHERE COALESCE(c."wardNumber", 1) IN ${wardSql}
        AND cdv."dueDate" < s.snapshot_month
    )
    SELECT
      ds.snapshot_month AS "snapshotMonth",
      ds.ward,
      ds."vaccineTypeId",
      ds."doseNumber",
      ds.gender,
      ds.ageGroup,
      ds.casteCode,
      COUNT(DISTINCT CASE WHEN ds.is_due = 1 THEN ds."childId" END) AS "totalDue",
      COUNT(DISTINCT CASE WHEN ds.is_completed = 1 THEN ds."childId" END) AS "totalCompleted",
      COUNT(DISTINCT CASE WHEN ds.is_dropout = 1 THEN ds."childId" END) AS "dropoutCount",
      CASE
        WHEN COUNT(DISTINCT CASE WHEN ds.is_due = 1 THEN ds."childId" END) > 0
        THEN ROUND((
          COUNT(DISTINCT CASE WHEN ds.is_dropout = 1 THEN ds."childId" END)::numeric /
          COUNT(DISTINCT CASE WHEN ds.is_due = 1 THEN ds."childId" END)
        ) * 100, 2)
        ELSE 0
      END AS "dropoutRate",
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    FROM dropout_stats ds
    GROUP BY ds.snapshot_month, ds.ward, ds."vaccineTypeId", ds."doseNumber", ds.gender, ds.ageGroup, ds.casteCode
    ON CONFLICT ("snapshotMonth", ward, "vaccineTypeId", "doseNumber", gender, "ageGroup", "casteCode") DO NOTHING;
  `);
  log('✅ Inserted missing past monthly dropout snapshots (immutable).');

  // Step 2: For current month, recompute and UPSERT (update if exists)
  await prisma.$executeRawUnsafe(`
    INSERT INTO "ChildMonthlyDropoutFact" (
      "snapshotMonth", "ward", "vaccineTypeId", "doseNumber", "gender", "ageGroup", "casteCode",
      "totalDue", "totalCompleted", "dropoutCount", "dropoutRate", "createdAt", "updatedAt"
    )
    WITH snapshots AS (
      SELECT DATE_TRUNC('month', CURRENT_DATE)::date AS snapshot_month
    ),
    dropout_stats AS (
      SELECT
        s.snapshot_month,
        COALESCE(c."wardNumber", 1) AS ward,
        cdv."vaccineTypeId",
        cdv."doseNumber",
        COALESCE(NULLIF(c."gender", ''), 'ALL') AS gender,
        CASE
          WHEN c."birthDate" IS NULL THEN 'ALL'
          WHEN EXTRACT(YEAR FROM AGE(s.snapshot_month, c."birthDate")) < 1 THEN '0-1y'
          WHEN EXTRACT(YEAR FROM AGE(s.snapshot_month, c."birthDate")) < 5 THEN '1-5y'
          ELSE '5y+'
        END AS ageGroup,
        COALESCE(c."casteCode", 0) AS casteCode,
        cdv."childId",
        (s.snapshot_month + INTERVAL '1 month - 1 day')::date AS snapshot_end,
        CASE WHEN cdv."dueDate" < (s.snapshot_month - INTERVAL '30 days') THEN 1 ELSE 0 END AS is_due,
        CASE WHEN vr."dateGiven" IS NOT NULL AND vr."dateGiven" <= (s.snapshot_month + INTERVAL '1 month - 1 day') THEN 1 ELSE 0 END AS is_completed,
        CASE WHEN cdv."dueDate" < (s.snapshot_month - INTERVAL '30 days')
          AND (vr."dateGiven" IS NULL OR vr."dateGiven" > (s.snapshot_month + INTERVAL '1 month - 1 day')) THEN 1 ELSE 0 END AS is_dropout
      FROM snapshots s
      CROSS JOIN "ChildDueVaccine" cdv
      JOIN "Child" c ON c.id = cdv."childId"
      LEFT JOIN "VaccinationRecord" vr ON vr."citizenId" = cdv."childId"
        AND vr."vaccineTypeId" = cdv."vaccineTypeId"
        AND vr."doseNumber" = cdv."doseNumber"
      WHERE COALESCE(c."wardNumber", 1) IN ${wardSql}
        AND cdv."dueDate" < s.snapshot_month
    )
    SELECT
      ds.snapshot_month AS "snapshotMonth",
      ds.ward,
      ds."vaccineTypeId",
      ds."doseNumber",
      ds.gender,
      ds.ageGroup,
      ds.casteCode,
      COUNT(DISTINCT CASE WHEN ds.is_due = 1 THEN ds."childId" END) AS "totalDue",
      COUNT(DISTINCT CASE WHEN ds.is_completed = 1 THEN ds."childId" END) AS "totalCompleted",
      COUNT(DISTINCT CASE WHEN ds.is_dropout = 1 THEN ds."childId" END) AS "dropoutCount",
      CASE
        WHEN COUNT(DISTINCT CASE WHEN ds.is_due = 1 THEN ds."childId" END) > 0
        THEN ROUND((
          COUNT(DISTINCT CASE WHEN ds.is_dropout = 1 THEN ds."childId" END)::numeric /
          COUNT(DISTINCT CASE WHEN ds.is_due = 1 THEN ds."childId" END)
        ) * 100, 2)
        ELSE 0
      END AS "dropoutRate",
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    FROM dropout_stats ds
    GROUP BY ds.snapshot_month, ds.ward, ds."vaccineTypeId", ds."doseNumber", ds.gender, ds.ageGroup, ds.casteCode
    ON CONFLICT ("snapshotMonth", ward, "vaccineTypeId", "doseNumber", gender, "ageGroup", "casteCode")
    DO UPDATE SET
      "totalDue" = EXCLUDED."totalDue",
      "totalCompleted" = EXCLUDED."totalCompleted",
      "dropoutCount" = EXCLUDED."dropoutCount",
      "dropoutRate" = EXCLUDED."dropoutRate",
      "updatedAt" = CURRENT_TIMESTAMP;
  `);
  log('✅ Updated current monthly dropout snapshot.');
}

/* =================================================
   CHILD ROLLING DROPOUT - Snapshot-based with variable windows (Immutable for past months)
   ================================================= */
async function updateChildRollingDropoutFacts(wardList) {
  if (!wardList || wardList.length === 0) {
    log('No child changes detected. Skipping Rolling Dropout facts.');
    return;
  }
  const wardSql = toSqlWardList(wardList);
  if (!wardSql) return;

  log(`🔄 Updating ChildRollingDropoutFact for wards ${wardSql} ...`);

  // No DELETE - preserve history

  // Define window types
  const windowTypes = [
    { type: '1M', days: 30 },
    { type: '3M', days: 90 },
    { type: '6M', days: 180 },
    { type: '12M', days: 365 }
  ];

  // For each window type...
  for (const win of windowTypes) {
    // Step 1: Insert for past months - only if missing (DO NOTHING)
    await prisma.$executeRawUnsafe(`
      INSERT INTO "ChildRollingDropoutFact" (
        "snapshotMonth", "windowType", "ward", "vaccineTypeId", "doseNumber", "gender", "ageGroup", "casteCode",
        "totalDue", "totalCompleted", "dropoutCount", "dropoutRate", "createdAt", "updatedAt"
      )
      WITH snapshots AS (
        SELECT generate_series(
          DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months'),
          DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'),
          '1 month'::interval
        )::date AS snapshot_month
      ),
      dropout_stats AS (
        SELECT
          s.snapshot_month,
          '${win.type}' AS window_type,
          COALESCE(c."wardNumber", 1) AS ward,
          cdv."vaccineTypeId",
          cdv."doseNumber",
          COALESCE(NULLIF(c."gender", ''), 'ALL') AS gender,
          CASE
            WHEN c."birthDate" IS NULL THEN 'ALL'
            WHEN EXTRACT(YEAR FROM AGE(s.snapshot_month, c."birthDate")) < 1 THEN '0-1y'
            WHEN EXTRACT(YEAR FROM AGE(s.snapshot_month, c."birthDate")) < 5 THEN '1-5y'
            ELSE '5y+'
          END AS ageGroup,
          COALESCE(c."casteCode", 0) AS casteCode,
          cdv."childId",
          (s.snapshot_month + INTERVAL '1 month - 1 day')::date AS snapshot_end,
          CASE WHEN cdv."dueDate" < (s.snapshot_month - INTERVAL '${win.days} days') THEN 1 ELSE 0 END AS is_due,
          CASE WHEN vr."dateGiven" IS NOT NULL AND vr."dateGiven" <= (s.snapshot_month + INTERVAL '1 month - 1 day') THEN 1 ELSE 0 END AS is_completed,
          CASE WHEN cdv."dueDate" < (s.snapshot_month - INTERVAL '${win.days} days')
            AND (vr."dateGiven" IS NULL OR vr."dateGiven" > (s.snapshot_month + INTERVAL '1 month - 1 day')) THEN 1 ELSE 0 END AS is_dropout
        FROM snapshots s
        CROSS JOIN "ChildDueVaccine" cdv
        JOIN "Child" c ON c.id = cdv."childId"
        LEFT JOIN "VaccinationRecord" vr ON vr."citizenId" = cdv."childId"
          AND vr."vaccineTypeId" = cdv."vaccineTypeId"
          AND vr."doseNumber" = cdv."doseNumber"
        WHERE COALESCE(c."wardNumber", 1) IN ${wardSql}
          AND cdv."dueDate" < s.snapshot_month
      )
      SELECT
        ds.snapshot_month AS "snapshotMonth",
        ds.window_type AS "windowType",
        ds.ward,
        ds."vaccineTypeId",
        ds."doseNumber",
        ds.gender,
        ds.ageGroup,
        ds.casteCode,
        COUNT(DISTINCT CASE WHEN ds.is_due = 1 THEN ds."childId" END) AS "totalDue",
        COUNT(DISTINCT CASE WHEN ds.is_completed = 1 THEN ds."childId" END) AS "totalCompleted",
        COUNT(DISTINCT CASE WHEN ds.is_dropout = 1 THEN ds."childId" END) AS "dropoutCount",
        CASE
          WHEN COUNT(DISTINCT CASE WHEN ds.is_due = 1 THEN ds."childId" END) > 0
          THEN ROUND((
            COUNT(DISTINCT CASE WHEN ds.is_dropout = 1 THEN ds."childId" END)::numeric /
            COUNT(DISTINCT CASE WHEN ds.is_due = 1 THEN ds."childId" END)
          ) * 100, 2)
          ELSE 0
        END AS "dropoutRate",
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      FROM dropout_stats ds
      GROUP BY ds.snapshot_month, ds.window_type, ds.ward, ds."vaccineTypeId", ds."doseNumber", ds.gender, ds.ageGroup, ds.casteCode
      ON CONFLICT ("snapshotMonth", "windowType", ward, "vaccineTypeId", "doseNumber", gender, "ageGroup", "casteCode") DO NOTHING;
    `);

    // Step 2: For current month, recompute and UPSERT
    await prisma.$executeRawUnsafe(`
      INSERT INTO "ChildRollingDropoutFact" (
        "snapshotMonth", "windowType", "ward", "vaccineTypeId", "doseNumber", "gender", "ageGroup", "casteCode",
        "totalDue", "totalCompleted", "dropoutCount", "dropoutRate", "createdAt", "updatedAt"
      )
      WITH snapshots AS (
        SELECT DATE_TRUNC('month', CURRENT_DATE)::date AS snapshot_month
      ),
      dropout_stats AS (
        SELECT
          s.snapshot_month,
          '${win.type}' AS window_type,
          COALESCE(c."wardNumber", 1) AS ward,
          cdv."vaccineTypeId",
          cdv."doseNumber",
          COALESCE(NULLIF(c."gender", ''), 'ALL') AS gender,
          CASE
            WHEN c."birthDate" IS NULL THEN 'ALL'
            WHEN EXTRACT(YEAR FROM AGE(s.snapshot_month, c."birthDate")) < 1 THEN '0-1y'
            WHEN EXTRACT(YEAR FROM AGE(s.snapshot_month, c."birthDate")) < 5 THEN '1-5y'
            ELSE '5y+'
          END AS ageGroup,
          COALESCE(c."casteCode", 0) AS casteCode,
          cdv."childId",
          (s.snapshot_month + INTERVAL '1 month - 1 day')::date AS snapshot_end,
          CASE WHEN cdv."dueDate" < (s.snapshot_month - INTERVAL '${win.days} days') THEN 1 ELSE 0 END AS is_due,
          CASE WHEN vr."dateGiven" IS NOT NULL AND vr."dateGiven" <= (s.snapshot_month + INTERVAL '1 month - 1 day') THEN 1 ELSE 0 END AS is_completed,
          CASE WHEN cdv."dueDate" < (s.snapshot_month - INTERVAL '${win.days} days')
            AND (vr."dateGiven" IS NULL OR vr."dateGiven" > (s.snapshot_month + INTERVAL '1 month - 1 day')) THEN 1 ELSE 0 END AS is_dropout
        FROM snapshots s
        CROSS JOIN "ChildDueVaccine" cdv
        JOIN "Child" c ON c.id = cdv."childId"
        LEFT JOIN "VaccinationRecord" vr ON vr."citizenId" = cdv."childId"
          AND vr."vaccineTypeId" = cdv."vaccineTypeId"
          AND vr."doseNumber" = cdv."doseNumber"
        WHERE COALESCE(c."wardNumber", 1) IN ${wardSql}
          AND cdv."dueDate" < s.snapshot_month
      )
      SELECT
        ds.snapshot_month AS "snapshotMonth",
        ds.window_type AS "windowType",
        ds.ward,
        ds."vaccineTypeId",
        ds."doseNumber",
        ds.gender,
        ds.ageGroup,
        ds.casteCode,
        COUNT(DISTINCT CASE WHEN ds.is_due = 1 THEN ds."childId" END) AS "totalDue",
        COUNT(DISTINCT CASE WHEN ds.is_completed = 1 THEN ds."childId" END) AS "totalCompleted",
        COUNT(DISTINCT CASE WHEN ds.is_dropout = 1 THEN ds."childId" END) AS "dropoutCount",
        CASE
          WHEN COUNT(DISTINCT CASE WHEN ds.is_due = 1 THEN ds."childId" END) > 0
          THEN ROUND((
            COUNT(DISTINCT CASE WHEN ds.is_dropout = 1 THEN ds."childId" END)::numeric /
            COUNT(DISTINCT CASE WHEN ds.is_due = 1 THEN ds."childId" END)
          ) * 100, 2)
          ELSE 0
        END AS "dropoutRate",
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      FROM dropout_stats ds
      GROUP BY ds.snapshot_month, ds.window_type, ds.ward, ds."vaccineTypeId", ds."doseNumber", ds.gender, ds.ageGroup, ds.casteCode
      ON CONFLICT ("snapshotMonth", "windowType", ward, "vaccineTypeId", "doseNumber", gender, "ageGroup", "casteCode")
      DO UPDATE SET
        "totalDue" = EXCLUDED."totalDue",
        "totalCompleted" = EXCLUDED."totalCompleted",
        "dropoutCount" = EXCLUDED."dropoutCount",
        "dropoutRate" = EXCLUDED."dropoutRate",
        "updatedAt" = CURRENT_TIMESTAMP;
    `);
    log(`✅ Updated current rolling dropout snapshot for ${win.type}.`);
  }
}

/* =================================================
   DATA QUALITY VALIDATION (Enhanced with dropout check)
   ================================================= */
async function validateDataQuality() {
  log('🔍 Running data quality validation...');

  try {
    // Check child counts
    const childCounts = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_records,
        COUNT(DISTINCT "ward") as unique_wards,
        AVG("totalRegisteredChildren") as avg_children,
        MAX("totalRegisteredChildren") as max_children
      FROM "ChildAnalyticsFact" 
      WHERE "day" = CURRENT_DATE
    `;

    log(`🧒 Child Facts: Records=${childCounts[0]?.total_records ?? 0}, Wards=${childCounts[0]?.unique_wards ?? 0}, Avg=${childCounts[0]?.avg_children ?? 0}, Max=${childCounts[0]?.max_children ?? 0}`);

    // Check mother counts
    const motherCounts = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_records,
        COUNT(DISTINCT "ward") as unique_wards,
        AVG("totalRegisteredMothers") as avg_mothers,
        MAX("totalRegisteredMothers") as max_mothers
      FROM "MotherAnalyticsFact" 
      WHERE "day" = CURRENT_DATE
    `;

    log(`🤰 Mother Facts: Records=${motherCounts[0]?.total_records ?? 0}, Wards=${motherCounts[0]?.unique_wards ?? 0}, Avg=${motherCounts[0]?.avg_mothers ?? 0}, Max=${motherCounts[0]?.max_mothers ?? 0}`);

    // Check growth counts
    const growthCounts = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_records,
        COUNT(DISTINCT "ward") as unique_wards,
        AVG("totalWeightRecords") as avg_records,
        MAX("totalWeightRecords") as max_records
      FROM "GrowthAnalyticsFact" 
      WHERE "day" = CURRENT_DATE
    `;

    log(`📈 Growth Facts: Records=${growthCounts[0]?.total_records ?? 0}, Wards=${growthCounts[0]?.unique_wards ?? 0}, Avg=${growthCounts[0]?.avg_records ?? 0}, Max=${growthCounts[0]?.max_records ?? 0}`);

    // Check for non-zero dropout rates
    const dropoutStats = await prisma.$queryRaw`
      SELECT 
        AVG("dropoutRate") as avg_rate,
        MAX("dropoutRate") as max_rate,
        COUNT(*) FILTER (WHERE "dropoutRate" > 0) as non_zero_count
      FROM "ChildMonthlyDropoutFact" 
      WHERE "snapshotMonth" >= CURRENT_DATE - INTERVAL '12 months'
    `;

    log(`📊 Monthly Dropout Stats: Avg=${dropoutStats[0]?.avg_rate ?? 0}, Max=${dropoutStats[0]?.max_rate ?? 0}, Non-zero records=${dropoutStats[0]?.non_zero_count ?? 0}`);

    const rollingStats = await prisma.$queryRaw`
      SELECT 
        "windowType",
        AVG("dropoutRate") as avg_rate,
        MAX("dropoutRate") as max_rate,
        COUNT(*) FILTER (WHERE "dropoutRate" > 0) as non_zero_count
      FROM "ChildRollingDropoutFact" 
      WHERE "snapshotMonth" >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY "windowType"
    `;

    rollingStats.forEach(stat => {
      log(`📊 Rolling (${stat.windowType}): Avg=${stat.avg_rate ?? 0}, Max=${stat.max_rate ?? 0}, Non-zero=${stat.non_zero_count ?? 0}`);
    });

  } catch (err) {
    log(`❌ Validation failed: ${err.message}`, '❌');
  }
}

/* =================================================
   MAIN: Incremental Orchestrator
   ================================================= */
export async function main() {
  log('🚀 Starting incremental analytics + monthly/rolling dropout...');
  console.time('TotalProcessingTime');

  try {
    // Fetch last processed timestamps
    const meta = await prisma.analyticsMeta.findFirst();
    const lastProcessedChild = meta?.lastProcessedChild || new Date(0);
    const lastProcessedMother = meta?.lastProcessedMother || new Date(0);
    const lastProcessedGrowth = meta?.lastProcessedGrowth || new Date(0);

    log(`📅 Last processed: Child=${lastProcessedChild}, Mother=${lastProcessedMother}, Growth=${lastProcessedGrowth}`);

    // Detect changed wards
    const { childWards, motherWards, growthWards } = await getChangedWards(
      lastProcessedChild,
      lastProcessedMother,
      lastProcessedGrowth
    );

    // Run updates
    await updateChildFactsForWards(childWards);
    await updateMotherFactsForWards(motherWards);
    await updateGrowthFactsForWards(growthWards);

    // Run dropout updates if child changes
    if (childWards.length > 0) {
      await updateChildMonthlyDropoutForWards(childWards);
      await updateChildRollingDropoutFacts(childWards);
    }

    // Update meta timestamps
    const now = new Date();
    await prisma.analyticsMeta.upsert({
      where: { id: 1 },
      update: {
        lastProcessedChild: childWards.length > 0 ? now : lastProcessedChild,
        lastProcessedMother: motherWards.length > 0 ? now : lastProcessedMother,
        lastProcessedGrowth: growthWards.length > 0 ? now : lastProcessedGrowth,
        updatedAt: now
      },
      create: {
        id: 1,
        lastProcessedChild: now,
        lastProcessedMother: now,
        lastProcessedGrowth: now
      }
    });

    log('📝 Updated AnalyticsMeta timestamps.');

    // Validate
    await validateDataQuality();

    console.timeEnd('TotalProcessingTime');
    log('🎉 Completed successfully!');

  } catch (error) {
    console.error('❌ Failed:', error);
    throw error;
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });