BEGIN;

WITH weight_agg AS (
  SELECT
    date_trunc('day', w."date")::date AS day,
    w."wardOfVaccination" AS ward,
    c."gender",
    CASE
      WHEN age(c."birthDate") < interval '12 months' THEN '0-11m'
      WHEN age(c."birthDate") < interval '24 months' THEN '12-23m'
      WHEN age(c."birthDate") < interval '60 months' THEN '24-59m'
      ELSE '5y+'
    END AS "ageGroup",
    AVG(w."weight") AS "avgWeight",
    COUNT(*) AS "recordsCount",
    SUM(CASE WHEN w."weight" < 2.5 THEN 1 ELSE 0 END) AS "severelyUnderweightCount",
    SUM(CASE WHEN w."weight" >= 2.5 AND w."weight" < 5 THEN 1 ELSE 0 END) AS "underweightCount",
    SUM(CASE WHEN w."weight" >= 5 AND w."weight" < 12 THEN 1 ELSE 0 END) AS "normalWeightCount",
    SUM(CASE WHEN w."weight" >= 12 THEN 1 ELSE 0 END) AS "overweightCount"
  FROM "WeightRecord" w
  JOIN "Child" c ON c."id" = w."childId"
  WHERE w."date" >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY 1,2,3,4
)
INSERT INTO "GrowthAnalyticsFact" (
  "day", "ward", "ageGroup", "gender",
  "underweightCount", "severelyUnderweightCount", "normalWeightCount",
  "overweightCount", "avgWeight", "recordsCount"
)
SELECT
  day, ward, "ageGroup", gender,
  "underweightCount", "severelyUnderweightCount", "normalWeightCount",
  "overweightCount", "avgWeight", "recordsCount"
FROM weight_agg
ON CONFLICT ("day","ward","gender","ageGroup")
DO UPDATE SET
  "underweightCount" = EXCLUDED."underweightCount",
  "severelyUnderweightCount" = EXCLUDED."severelyUnderweightCount",
  "normalWeightCount" = EXCLUDED."normalWeightCount",
  "overweightCount" = EXCLUDED."overweightCount",
  "avgWeight" = EXCLUDED."avgWeight",
  "recordsCount" = EXCLUDED."recordsCount";

COMMIT;
