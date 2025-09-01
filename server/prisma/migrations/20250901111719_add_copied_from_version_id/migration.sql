-- AlterTable
ALTER TABLE "public"."VaccineScheduleVersion" ADD COLUMN     "copiedFromVersionId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."VaccineScheduleVersion" ADD CONSTRAINT "VaccineScheduleVersion_copiedFromVersionId_fkey" FOREIGN KEY ("copiedFromVersionId") REFERENCES "public"."VaccineScheduleVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
