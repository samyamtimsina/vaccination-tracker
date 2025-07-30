/*
  Warnings:

  - The values [bOPV,HPV] on the enum `VaccineType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VaccineType_new" AS ENUM ('BCG', 'ROTA', 'OPV', 'DPT_HepB_hib', 'fIPV', 'PCV', 'MR', 'JE', 'TCV', 'OTHERS');
ALTER TABLE "VaccinationRecord" ALTER COLUMN "vaccineType" TYPE "VaccineType_new" USING ("vaccineType"::text::"VaccineType_new");
ALTER TYPE "VaccineType" RENAME TO "VaccineType_old";
ALTER TYPE "VaccineType_new" RENAME TO "VaccineType";
DROP TYPE "VaccineType_old";
COMMIT;

-- AlterTable
ALTER TABLE "VaccinationRecord" ADD COLUMN     "customVaccineName" TEXT;
