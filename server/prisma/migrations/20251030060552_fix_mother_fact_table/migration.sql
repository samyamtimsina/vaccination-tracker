/*
  Warnings:

  - Made the column `updatedAt` on table `VaccinationRecord` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."MotherAnalyticsFact" ADD COLUMN     "coverage" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "dropoutRate" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."VaccinationRecord" ALTER COLUMN "updatedAt" SET NOT NULL;
