/*
  Warnings:

  - You are about to drop the `CatchUpRule` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `isBooster` on table `Dose` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isPrimary` on table `Dose` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."CatchUpRule" DROP CONSTRAINT "CatchUpRule_scheduleVersionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CatchUpRule" DROP CONSTRAINT "CatchUpRule_vaccineTypeId_fkey";

-- AlterTable
ALTER TABLE "public"."Dose" ADD COLUMN     "maxAgeDays" DOUBLE PRECISION,
ADD COLUMN     "maxAgeMonths" DOUBLE PRECISION,
ADD COLUMN     "maxAgeWeeks" DOUBLE PRECISION,
ADD COLUMN     "maxAgeYears" DOUBLE PRECISION,
ALTER COLUMN "isBooster" SET NOT NULL,
ALTER COLUMN "isPrimary" SET NOT NULL;

-- DropTable
DROP TABLE "public"."CatchUpRule";
