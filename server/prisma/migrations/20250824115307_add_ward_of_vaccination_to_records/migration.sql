/*
  Warnings:

  - Added the required column `wardOfVaccination` to the `VaccinationRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wardOfVaccination` to the `WeightRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."VaccinationRecord" ADD COLUMN     "wardOfVaccination" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."WeightRecord" ADD COLUMN     "wardOfVaccination" INTEGER NOT NULL;
