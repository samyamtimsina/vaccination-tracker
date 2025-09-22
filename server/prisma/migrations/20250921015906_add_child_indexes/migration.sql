-- CreateIndex
CREATE INDEX "Child_fullName_idx" ON "public"."Child"("fullName");

-- CreateIndex
CREATE INDEX "Child_parentName_idx" ON "public"."Child"("parentName");

-- CreateIndex
CREATE INDEX "Child_birthDate_idx" ON "public"."Child"("birthDate");

-- CreateIndex
CREATE INDEX "Child_createdAt_idx" ON "public"."Child"("createdAt");
