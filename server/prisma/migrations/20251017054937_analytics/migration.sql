/*
  Warnings:

  - The primary key for the `AnalyticsMeta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `domain` on the `AnalyticsMeta` table. All the data in the column will be lost.
  - You are about to drop the column `lastProcessedTimestamptz` on the `AnalyticsMeta` table. All the data in the column will be lost.
  - You are about to drop the column `dropoutFirstLast` on the `ChildAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `isExternal` on the `ChildAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `municipality` on the `ChildAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `ChildAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `upcomingDue` on the `ChildAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `avgWeight` on the `GrowthAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `municipality` on the `GrowthAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `GrowthAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `recordsCount` on the `GrowthAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `severelyUnderweightCount` on the `GrowthAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `ageGroup` on the `MotherAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `municipality` on the `MotherAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `MotherAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `td1Given` on the `MotherAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `td2Given` on the `MotherAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `td2Late` on the `MotherAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `td2OnTime` on the `MotherAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `td2plusGiven` on the `MotherAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `tdDropoutFirstLast` on the `MotherAnalyticsFact` table. All the data in the column will be lost.
  - You are about to drop the column `tdDropoutRate` on the `MotherAnalyticsFact` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `AnalyticsMeta` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[day,ward,vaccineTypeId,doseNumber,gender,ageGroup,casteCode]` on the table `ChildAnalyticsFact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[day,ward,gender,ageGroup,casteCode]` on the table `GrowthAnalyticsFact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[day,ward,doseNumber,casteCode]` on the table `MotherAnalyticsFact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `AnalyticsMeta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `casteCode` to the `ChildAnalyticsFact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ChildAnalyticsFact` table without a default value. This is not possible if the table is not empty.
  - Made the column `ward` on table `ChildAnalyticsFact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `doseNumber` on table `ChildAnalyticsFact` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `casteCode` to the `GrowthAnalyticsFact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `GrowthAnalyticsFact` table without a default value. This is not possible if the table is not empty.
  - Made the column `ward` on table `GrowthAnalyticsFact` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `casteCode` to the `MotherAnalyticsFact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MotherAnalyticsFact` table without a default value. This is not possible if the table is not empty.
  - Made the column `ward` on table `MotherAnalyticsFact` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."ChildAnalyticsFact_day_ward_vaccineTypeId_doseNumber_gender_key";

-- DropIndex
DROP INDEX "public"."GrowthAnalyticsFact_day_ward_gender_ageGroup_key";

-- DropIndex
DROP INDEX "public"."MotherAnalyticsFact_day_ward_ageGroup_key";

-- AlterTable
ALTER TABLE "public"."AnalyticsMeta" DROP CONSTRAINT "AnalyticsMeta_pkey",
DROP COLUMN "domain",
DROP COLUMN "lastProcessedTimestamptz",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "lastProcessedChild" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastProcessedGrowth" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastProcessedMother" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "AnalyticsMeta_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."ChildAnalyticsFact" DROP COLUMN "dropoutFirstLast",
DROP COLUMN "isExternal",
DROP COLUMN "municipality",
DROP COLUMN "province",
DROP COLUMN "upcomingDue",
ADD COLUMN     "casteCode" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "ward" SET NOT NULL,
ALTER COLUMN "doseNumber" SET NOT NULL,
ALTER COLUMN "doseNumber" SET DEFAULT 0,
ALTER COLUMN "dropoutRate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."GrowthAnalyticsFact" DROP COLUMN "avgWeight",
DROP COLUMN "municipality",
DROP COLUMN "province",
DROP COLUMN "recordsCount",
DROP COLUMN "severelyUnderweightCount",
ADD COLUMN     "avgWeightKg" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "casteCode" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "totalWeightRecords" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "ward" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."MotherAnalyticsFact" DROP COLUMN "ageGroup",
DROP COLUMN "municipality",
DROP COLUMN "province",
DROP COLUMN "td1Given",
DROP COLUMN "td2Given",
DROP COLUMN "td2Late",
DROP COLUMN "td2OnTime",
DROP COLUMN "td2plusGiven",
DROP COLUMN "tdDropoutFirstLast",
DROP COLUMN "tdDropoutRate",
ADD COLUMN     "casteCode" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "doseNumber" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dueToday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "mothersWithFullTD" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "mothersWithZeroTD" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "overdue" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tdDosesGiven" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "ward" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsMeta_id_key" ON "public"."AnalyticsMeta"("id");

-- CreateIndex
CREATE INDEX "ChildAnalyticsFact_casteCode_idx" ON "public"."ChildAnalyticsFact"("casteCode");

-- CreateIndex
CREATE INDEX "ChildAnalyticsFact_gender_idx" ON "public"."ChildAnalyticsFact"("gender");

-- CreateIndex
CREATE UNIQUE INDEX "ChildAnalyticsFact_day_ward_vaccineTypeId_doseNumber_gender_key" ON "public"."ChildAnalyticsFact"("day", "ward", "vaccineTypeId", "doseNumber", "gender", "ageGroup", "casteCode");

-- CreateIndex
CREATE INDEX "GrowthAnalyticsFact_casteCode_idx" ON "public"."GrowthAnalyticsFact"("casteCode");

-- CreateIndex
CREATE INDEX "GrowthAnalyticsFact_gender_idx" ON "public"."GrowthAnalyticsFact"("gender");

-- CreateIndex
CREATE INDEX "GrowthAnalyticsFact_ageGroup_idx" ON "public"."GrowthAnalyticsFact"("ageGroup");

-- CreateIndex
CREATE UNIQUE INDEX "GrowthAnalyticsFact_day_ward_gender_ageGroup_casteCode_key" ON "public"."GrowthAnalyticsFact"("day", "ward", "gender", "ageGroup", "casteCode");

-- CreateIndex
CREATE INDEX "MotherAnalyticsFact_casteCode_idx" ON "public"."MotherAnalyticsFact"("casteCode");

-- CreateIndex
CREATE UNIQUE INDEX "MotherAnalyticsFact_day_ward_doseNumber_casteCode_key" ON "public"."MotherAnalyticsFact"("day", "ward", "doseNumber", "casteCode");
