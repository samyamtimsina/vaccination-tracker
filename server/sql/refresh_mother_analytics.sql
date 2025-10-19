BEGIN;

WITH td_agg AS (
  SELECT
    date_trunc('day', t."dateGiven")::date AS day,
    m."wardNumber" AS ward,
    CASE
      WHEN age(m."dateOfBirth") < interval '20 years' THEN 'under20'
      WHEN age(m."dateOfBirth") < interval '30 years' THEN '20-29'
      ELSE '30plus'
    END AS "ageGroup",
    COUNT(*) FILTER (WHERE t."doseNumber" = 1) AS "td1Given",
    COUNT(*) FILTER (WHERE t."doseNumber" = 2) AS "td2Given",
    COUNT(*) FILTER (WHERE t."doseNumber" >= 3) AS "td2plusGiven"
  FROM "TDDose" t
  JOIN "Mother" m ON m."id" = t."motherId"
  WHERE t."dateGiven" >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY 1,2,3
),
reg_mothers AS (
  SELECT CURRENT_DATE::date AS day, m."wardNumber" AS ward,
    CASE
      WHEN age(m."dateOfBirth") < interval '20 years' THEN 'under20'
      WHEN age(m."dateOfBirth") < interval '30 years' THEN '20-29'
      ELSE '30plus'
    END AS "ageGroup",
    COUNT(*) AS "totalRegisteredMothers"
  FROM "Mother" m
  GROUP BY 1,2,3
)
INSERT INTO "MotherAnalyticsFact" (
  "day", "ward", "ageGroup",
  "totalRegisteredMothers", "td1Given", "td2Given", "td2plusGiven"
)
SELECT
  t.day, t.ward, t."ageGroup",
  COALESCE(r."totalRegisteredMothers",0),
  COALESCE(t."td1Given",0),
  COALESCE(t."td2Given",0),
  COALESCE(t."td2plusGiven",0)
FROM td_agg t
LEFT JOIN reg_mothers r USING (ward, "ageGroup")
ON CONFLICT ("day","ward","ageGroup")
DO UPDATE SET
  "totalRegisteredMothers" = EXCLUDED."totalRegisteredMothers",
  "td1Given" = EXCLUDED."td1Given",
  "td2Given" = EXCLUDED."td2Given",
  "td2plusGiven" = EXCLUDED."td2plusGiven";

COMMIT;
