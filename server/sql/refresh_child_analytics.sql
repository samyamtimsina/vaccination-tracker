BEGIN;

-- 1) per-vaccination aggregates (keeps ageGroup but we'll collapse later)
WITH vax_agg AS (
  SELECT
    date_trunc('day', v."dateGiven")::date AS "day",
    v."wardOfVaccination" AS "ward",
    v."vaccineTypeId",
    v."doseNumber",
    c."gender",
    CASE
      WHEN age(c."birthDate") < interval '12 months' THEN '0-11m'
      WHEN age(c."birthDate") < interval '24 months' THEN '12-23m'
      WHEN age(c."birthDate") < interval '5 years' THEN '24-59m'
      ELSE '5y+'
    END AS "ageGroup",
    COUNT(DISTINCT v."citizenId") AS "vaccinatedChildren",
    SUM(CASE WHEN dv."dueDate" IS NOT NULL AND v."dateGiven" <= dv."dueDate" THEN 1 ELSE 0 END) AS "onTime",
    SUM(CASE WHEN dv."dueDate" IS NOT NULL AND v."dateGiven" > dv."dueDate" THEN 1 ELSE 0 END) AS "late"
  FROM "VaccinationRecord" v
  JOIN "Child" c ON c."id" = v."citizenId"
  LEFT JOIN "ChildDueVaccine" dv
    ON dv."childId" = c."id"
   AND dv."vaccineTypeId" = v."vaccineTypeId"
   AND dv."doseNumber" = v."doseNumber"
  WHERE v."dateGiven" >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY 1,2,3,4,5,6
),

-- 2) due/overdue/upcoming counts (per ward/vaccine/dose/gender/ageGroup)
due_agg AS (
  SELECT
    CURRENT_DATE::date AS "day",
    c."wardNumber" AS "ward",
    dv."vaccineTypeId",
    dv."doseNumber",
    c."gender",
    CASE
      WHEN age(c."birthDate") < interval '12 months' THEN '0-11m'
      WHEN age(c."birthDate") < interval '24 months' THEN '12-23m'
      WHEN age(c."birthDate") < interval '5 years' THEN '24-59m'
      ELSE '5y+'
    END AS "ageGroup",
    SUM(CASE WHEN dv."isCompleted" = false AND dv."dueDate" = CURRENT_DATE THEN 1 ELSE 0 END) AS "dueToday",
    SUM(CASE WHEN dv."isCompleted" = false AND dv."dueDate" < CURRENT_DATE THEN 1 ELSE 0 END) AS "overdue",
    SUM(CASE WHEN dv."isCompleted" = false AND dv."dueDate" > CURRENT_DATE THEN 1 ELSE 0 END) AS "upcomingDue"
  FROM "ChildDueVaccine" dv
  JOIN "Child" c ON c."id" = dv."childId"
  GROUP BY 1,2,3,4,5,6
),

-- 3) registered children counts (per ward/gender/ageGroup)
reg_agg AS (
  SELECT
    CURRENT_DATE::date AS "day",
    c."wardNumber" AS "ward",
    c."gender",
    CASE
      WHEN age(c."birthDate") < interval '12 months' THEN '0-11m'
      WHEN age(c."birthDate") < interval '24 months' THEN '12-23m'
      WHEN age(c."birthDate") < interval '5 years' THEN '24-59m'
      ELSE '5y+'
    END AS "ageGroup",
    COUNT(*) AS "totalRegisteredChildren"
  FROM "Child" c
  GROUP BY 1,2,3,4
),

-- 4) join the pieces into one merged row set that may still have multiple rows per final key
merged AS (
  SELECT
    v."day",
    v."ward",
    v."vaccineTypeId",
    v."doseNumber",
    v."gender",
    v."ageGroup",
    COALESCE(v."vaccinatedChildren",0) AS "vaccinatedChildren",
    COALESCE(d."dueToday",0) AS "dueToday",
    COALESCE(d."overdue",0) AS "overdue",
    COALESCE(d."upcomingDue",0) AS "upcomingDue",
    COALESCE(v."onTime",0) AS "onTime",
    COALESCE(v."late",0) AS "late",
    COALESCE(r."totalRegisteredChildren",0) AS "totalRegisteredChildren"
  FROM vax_agg v
  LEFT JOIN due_agg d
    ON d."ward" = v."ward"
   AND d."vaccineTypeId" = v."vaccineTypeId"
   AND d."doseNumber" = v."doseNumber"
   AND d."gender" = v."gender"
   AND d."ageGroup" = v."ageGroup"
  LEFT JOIN reg_agg r
    ON r."ward" = v."ward"
   AND r."gender" = v."gender"
   AND r."ageGroup" = v."ageGroup"
),

-- 5) collapse/aggregate by the exact conflict key to guarantee uniqueness
dedup AS (
  SELECT
    "day",
    "ward",
    "vaccineTypeId",
    "doseNumber",
    "gender",
    SUM("vaccinatedChildren") AS "vaccinatedChildren",
    SUM("dueToday") AS "dueToday",
    SUM("overdue") AS "overdue",
    SUM("upcomingDue") AS "upcomingDue",
    SUM("onTime") AS "onTime",
    SUM("late") AS "late",
    SUM("totalRegisteredChildren") AS "totalRegisteredChildren"
  FROM merged
  GROUP BY "day","ward","vaccineTypeId","doseNumber","gender"
)

-- 6) insert the unique rows (ageGroup intentionally omitted because we aggregated across it)
INSERT INTO "ChildAnalyticsFact" (
  "day","ward","vaccineTypeId","doseNumber","gender",
  "vaccinatedChildren","zeroDoseChildren","dueToday","overdue","upcomingDue",
  "onTime","late","dropoutFirstLast","dropoutRate","totalRegisteredChildren"
)
SELECT
  "day","ward","vaccineTypeId","doseNumber","gender",
  "vaccinatedChildren", -- aggregated
  0,                    -- zeroDoseChildren placeholder; can be filled by separate job if needed
  "dueToday","overdue","upcomingDue",
  "onTime","late",
  0,0.0,
  "totalRegisteredChildren"
FROM dedup
ON CONFLICT ("day","ward","vaccineTypeId","doseNumber","gender")
DO UPDATE SET
  "vaccinatedChildren" = EXCLUDED."vaccinatedChildren",
  "dueToday" = EXCLUDED."dueToday",
  "overdue" = EXCLUDED."overdue",
  "upcomingDue" = EXCLUDED."upcomingDue",
  "onTime" = EXCLUDED."onTime",
  "late" = EXCLUDED."late",
  "totalRegisteredChildren" = EXCLUDED."totalRegisteredChildren";

COMMIT;
