/*
  Warnings:

  - You are about to drop the column `vaccineType` on the `CatchUpRule` table. All the data in the column will be lost.
  - You are about to drop the column `vaccineType` on the `ChildDueVaccine` table. All the data in the column will be lost.
  - You are about to drop the column `vaccineType` on the `Dose` table. All the data in the column will be lost.
  - You are about to drop the column `vaccineType` on the `VaccinationRecord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vaccineTypeId,doseNumber,scheduleVersionId]` on the table `Dose` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vaccineTypeId` to the `CatchUpRule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vaccineTypeId` to the `ChildDueVaccine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vaccineTypeId` to the `Dose` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vaccineTypeId` to the `VaccinationRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Dose_vaccineType_doseNumber_scheduleVersionId_key";

-- AlterTable
ALTER TABLE "public"."CatchUpRule" DROP COLUMN "vaccineType",
ADD COLUMN     "vaccineTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."ChildDueVaccine" DROP COLUMN "vaccineType",
ADD COLUMN     "vaccineTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Dose" DROP COLUMN "vaccineType",
ADD COLUMN     "vaccineTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."VaccinationRecord" DROP COLUMN "vaccineType",
ADD COLUMN     "vaccineTypeId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "public"."VaccineType";

-- CreateTable
CREATE TABLE "public"."VaccineType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VaccineType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VaccineType_name_key" ON "public"."VaccineType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Dose_vaccineTypeId_doseNumber_scheduleVersionId_key" ON "public"."Dose"("vaccineTypeId", "doseNumber", "scheduleVersionId");

-- AddForeignKey
ALTER TABLE "public"."VaccinationRecord" ADD CONSTRAINT "VaccinationRecord_vaccineTypeId_fkey" FOREIGN KEY ("vaccineTypeId") REFERENCES "public"."VaccineType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Dose" ADD CONSTRAINT "Dose_vaccineTypeId_fkey" FOREIGN KEY ("vaccineTypeId") REFERENCES "public"."VaccineType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChildDueVaccine" ADD CONSTRAINT "ChildDueVaccine_vaccineTypeId_fkey" FOREIGN KEY ("vaccineTypeId") REFERENCES "public"."VaccineType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CatchUpRule" ADD CONSTRAINT "CatchUpRule_vaccineTypeId_fkey" FOREIGN KEY ("vaccineTypeId") REFERENCES "public"."VaccineType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
