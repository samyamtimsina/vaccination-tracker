-- AlterTable
ALTER TABLE "public"."Dose" ADD COLUMN     "maxSchoolClass" INTEGER,
ADD COLUMN     "minBirthYear" INTEGER,
ADD COLUMN     "minSchoolClass" INTEGER,
ADD COLUMN     "otherCriteria" JSONB,
ADD COLUMN     "requiredGender" TEXT;

-- CreateIndex
CREATE INDEX "ChildDueVaccine_childId_vaccineTypeId_doseNumber_idx" ON "public"."ChildDueVaccine"("childId", "vaccineTypeId", "doseNumber");

-- CreateIndex
CREATE INDEX "VaccinationRecord_dateGiven_idx" ON "public"."VaccinationRecord"("dateGiven");

-- CreateIndex
CREATE INDEX "VaccinationRecord_vaccineTypeId_idx" ON "public"."VaccinationRecord"("vaccineTypeId");

-- CreateIndex
CREATE INDEX "VaccinationRecord_administeredById_idx" ON "public"."VaccinationRecord"("administeredById");

-- CreateIndex
CREATE INDEX "WeightRecord_wardOfVaccination_idx" ON "public"."WeightRecord"("wardOfVaccination");
