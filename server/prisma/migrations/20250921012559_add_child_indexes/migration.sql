-- CreateIndex
CREATE INDEX "Child_wardNumber_idx" ON "public"."Child"("wardNumber");

-- CreateIndex
CREATE INDEX "Child_phoneNumber_idx" ON "public"."Child"("phoneNumber");

-- CreateIndex
CREATE INDEX "ChildDueVaccine_childId_isCompleted_idx" ON "public"."ChildDueVaccine"("childId", "isCompleted");

-- CreateIndex
CREATE INDEX "VaccinationRecord_citizenId_dateGiven_idx" ON "public"."VaccinationRecord"("citizenId", "dateGiven");

-- CreateIndex
CREATE INDEX "VaccinationRecord_wardOfVaccination_idx" ON "public"."VaccinationRecord"("wardOfVaccination");

-- CreateIndex
CREATE INDEX "WeightRecord_childId_date_idx" ON "public"."WeightRecord"("childId", "date");
