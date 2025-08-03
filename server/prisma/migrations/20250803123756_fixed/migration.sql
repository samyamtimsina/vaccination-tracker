/*
  Warnings:

  - You are about to drop the `Citizen` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Citizen" DROP CONSTRAINT "Citizen_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."NotificationLog" DROP CONSTRAINT "NotificationLog_citizenId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VaccinationRecord" DROP CONSTRAINT "VaccinationRecord_citizenId_fkey";

-- DropTable
DROP TABLE "public"."Citizen";

-- CreateTable
CREATE TABLE "public"."Child" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "wardNumber" TEXT NOT NULL,
    "casteCode" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "tole" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "purnaKhop" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Child" ADD CONSTRAINT "Child_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VaccinationRecord" ADD CONSTRAINT "VaccinationRecord_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "public"."Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NotificationLog" ADD CONSTRAINT "NotificationLog_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "public"."Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
