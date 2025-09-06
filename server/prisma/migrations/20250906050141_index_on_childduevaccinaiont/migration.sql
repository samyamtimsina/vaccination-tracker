-- CreateIndex
CREATE INDEX "ChildDueVaccine_dueDate_isCompleted_notificationSent_idx" ON "public"."ChildDueVaccine"("dueDate", "isCompleted", "notificationSent");
