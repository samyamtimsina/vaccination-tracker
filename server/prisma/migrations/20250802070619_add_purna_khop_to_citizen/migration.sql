/*
  Warnings:

  - You are about to drop the column `address` on the `Citizen` table. All the data in the column will be lost.
  - Added the required column `gender` to the `Citizen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tole` to the `Citizen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."VaccineType" ADD VALUE 'HPV';

-- AlterTable
ALTER TABLE "public"."Citizen" DROP COLUMN "address",
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "purnaKhop" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "tole" TEXT NOT NULL,
ALTER COLUMN "wardNumber" SET DATA TYPE TEXT;
