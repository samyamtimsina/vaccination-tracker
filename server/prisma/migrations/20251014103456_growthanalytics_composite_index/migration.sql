/*
  Warnings:

  - A unique constraint covering the columns `[day,ward,gender,ageGroup]` on the table `GrowthAnalyticsFact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GrowthAnalyticsFact_day_ward_gender_ageGroup_key" ON "public"."GrowthAnalyticsFact"("day", "ward", "gender", "ageGroup");
