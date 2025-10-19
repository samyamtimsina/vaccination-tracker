/*
  Warnings:

  - A unique constraint covering the columns `[day,ward,vaccineTypeId,doseNumber,gender]` on the table `ChildAnalyticsFact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[day,ward,ageGroup]` on the table `MotherAnalyticsFact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChildAnalyticsFact_day_ward_vaccineTypeId_doseNumber_gender_key" ON "public"."ChildAnalyticsFact"("day", "ward", "vaccineTypeId", "doseNumber", "gender");

-- CreateIndex
CREATE UNIQUE INDEX "MotherAnalyticsFact_day_ward_ageGroup_key" ON "public"."MotherAnalyticsFact"("day", "ward", "ageGroup");
