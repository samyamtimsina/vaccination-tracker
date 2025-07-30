/*
  Warnings:

  - You are about to drop the `Child` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mother` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "VaccineType" AS ENUM ('BCG', 'bOPV', 'DPT_HepB_hib', 'fIPV', 'PCV', 'MR', 'JE', 'HPV', 'TCV');

-- DropForeignKey
ALTER TABLE "Child" DROP CONSTRAINT "Child_motherId_fkey";

-- DropTable
DROP TABLE "Child";

-- DropTable
DROP TABLE "Mother";

-- CreateTable
CREATE TABLE "Citizen" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "wardNumber" INTEGER NOT NULL,
    "parentName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "casteCode" INTEGER NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Citizen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VaccinationRecord" (
    "id" TEXT NOT NULL,
    "citizenId" TEXT NOT NULL,
    "vaccineType" "VaccineType" NOT NULL,
    "doseNumber" INTEGER NOT NULL,
    "dateGiven" TIMESTAMP(3) NOT NULL,
    "isComplete" BOOLEAN NOT NULL,
    "remarks" TEXT,
    "recommendedAtMonths" INTEGER NOT NULL,

    CONSTRAINT "VaccinationRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Citizen" ADD CONSTRAINT "Citizen_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaccinationRecord" ADD CONSTRAINT "VaccinationRecord_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "Citizen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
