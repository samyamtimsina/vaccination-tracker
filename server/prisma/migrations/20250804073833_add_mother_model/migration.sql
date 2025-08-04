/*
  Warnings:

  - Added the required column `sewaDartaNumber` to the `Child` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `wardNumber` on the `Child` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Child" ADD COLUMN     "sewaDartaNumber" INTEGER NOT NULL,
DROP COLUMN "wardNumber",
ADD COLUMN     "wardNumber" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."Mother" (
    "id" TEXT NOT NULL,
    "sewaDartaNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "casteCode" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "tole" TEXT NOT NULL,
    "wardNumber" INTEGER NOT NULL,
    "pregnancyCount" INTEGER NOT NULL,
    "previousTDTakenCount" INTEGER NOT NULL,
    "tdDose1" TIMESTAMP(3),
    "tdDose2" TIMESTAMP(3),
    "tdDose2Plus" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mother_pkey" PRIMARY KEY ("id")
);
