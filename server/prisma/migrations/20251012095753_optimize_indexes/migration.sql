-- CreateIndex
CREATE INDEX "Child_wardNumber_createdAt_idx" ON "public"."Child"("wardNumber", "createdAt");

-- CreateIndex
CREATE INDEX "ChildDueVaccine_childId_dueDate_idx" ON "public"."ChildDueVaccine"("childId", "dueDate");

-- CreateIndex
CREATE INDEX "Mother_wardNumber_createdAt_idx" ON "public"."Mother"("wardNumber", "createdAt");

-- CreateIndex
CREATE INDEX "NotificationLog_motherId_sentAt_idx" ON "public"."NotificationLog"("motherId", "sentAt");

-- CreateIndex
CREATE INDEX "NotificationLog_childId_sentAt_idx" ON "public"."NotificationLog"("childId", "sentAt");

-- CreateIndex
CREATE INDEX "VaccinationRecord_wardOfVaccination_dateGiven_idx" ON "public"."VaccinationRecord"("wardOfVaccination", "dateGiven");

-- CreateIndex
CREATE INDEX "VaccinationRecord_vaccineTypeId_dateGiven_idx" ON "public"."VaccinationRecord"("vaccineTypeId", "dateGiven");
