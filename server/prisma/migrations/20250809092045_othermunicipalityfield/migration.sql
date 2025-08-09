/*
  Warnings:

  - The values [OTHERS] on the enum `VaccineType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."VaccineType_new" AS ENUM ('BCG', 'ROTA', 'OPV', 'fIPV', 'PCV', 'DPT_HepB_hib', 'MR', 'JE', 'TCV', 'HPV');
ALTER TABLE "public"."VaccinationRecord" ALTER COLUMN "vaccineType" TYPE "public"."VaccineType_new" USING ("vaccineType"::text::"public"."VaccineType_new");
ALTER TABLE "public"."NotificationLog" ALTER COLUMN "vaccineType" TYPE "public"."VaccineType_new" USING ("vaccineType"::text::"public"."VaccineType_new");
ALTER TYPE "public"."VaccineType" RENAME TO "VaccineType_old";
ALTER TYPE "public"."VaccineType_new" RENAME TO "VaccineType";
DROP TYPE "public"."VaccineType_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Child" ADD COLUMN     "isFromOtherMunicipality" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Mother" ADD COLUMN     "isFromOtherMunicipality" BOOLEAN NOT NULL DEFAULT false;
