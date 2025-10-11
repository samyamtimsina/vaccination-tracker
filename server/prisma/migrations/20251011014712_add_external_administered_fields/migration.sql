-- AlterTable
ALTER TABLE "public"."VaccinationRecord" ADD COLUMN     "externalAdministeredBy" TEXT,
ADD COLUMN     "isExternallyAdministered" BOOLEAN NOT NULL DEFAULT false;
