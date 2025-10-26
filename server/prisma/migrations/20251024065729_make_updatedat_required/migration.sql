/*
  Warnings:

  - Made the column `updatedAt` on table `Child` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Mother` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `TDDose` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Child" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Mother" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."TDDose" ALTER COLUMN "updatedAt" SET NOT NULL;
