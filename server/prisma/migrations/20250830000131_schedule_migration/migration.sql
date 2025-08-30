/*
  Warnings:

  - You are about to drop the column `nextDueDate` on the `Child` table. All the data in the column will be lost.
  - You are about to drop the column `nextDueDoseNumber` on the `Child` table. All the data in the column will be lost.
  - You are about to drop the column `nextDueVaccine` on the `Child` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vaccineType,doseNumber,scheduleVersionId]` on the table `Dose` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."CatchUpRule_vaccineType_key";

-- DropIndex
DROP INDEX "public"."Dose_vaccineType_doseNumber_key";

-- AlterTable
ALTER TABLE "public"."CatchUpRule" ADD COLUMN     "scheduleVersionId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."Child" DROP COLUMN "nextDueDate",
DROP COLUMN "nextDueDoseNumber",
DROP COLUMN "nextDueVaccine";

-- AlterTable
ALTER TABLE "public"."Dose" ADD COLUMN     "scheduleVersionId" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "public"."ChildDueVaccine" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "vaccineType" "public"."VaccineType" NOT NULL,
    "doseNumber" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduleVersion" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ChildDueVaccine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dose_vaccineType_doseNumber_scheduleVersionId_key" ON "public"."Dose"("vaccineType", "doseNumber", "scheduleVersionId");

-- AddForeignKey
ALTER TABLE "public"."Dose" ADD CONSTRAINT "Dose_scheduleVersionId_fkey" FOREIGN KEY ("scheduleVersionId") REFERENCES "public"."VaccineScheduleVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChildDueVaccine" ADD CONSTRAINT "ChildDueVaccine_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CatchUpRule" ADD CONSTRAINT "CatchUpRule_scheduleVersionId_fkey" FOREIGN KEY ("scheduleVersionId") REFERENCES "public"."VaccineScheduleVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
