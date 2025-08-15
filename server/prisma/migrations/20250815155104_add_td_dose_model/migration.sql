/*
  Warnings:

  - You are about to drop the column `tdDose1` on the `Mother` table. All the data in the column will be lost.
  - You are about to drop the column `tdDose2` on the `Mother` table. All the data in the column will be lost.
  - You are about to drop the column `tdDose2Plus` on the `Mother` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Mother" DROP COLUMN "tdDose1",
DROP COLUMN "tdDose2",
DROP COLUMN "tdDose2Plus";

-- CreateTable
CREATE TABLE "public"."TDDose" (
    "id" TEXT NOT NULL,
    "doseNumber" INTEGER NOT NULL,
    "dateGiven" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,
    "motherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "administeredById" INTEGER NOT NULL,

    CONSTRAINT "TDDose_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TDDose" ADD CONSTRAINT "TDDose_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "public"."Mother"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TDDose" ADD CONSTRAINT "TDDose_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TDDose" ADD CONSTRAINT "TDDose_administeredById_fkey" FOREIGN KEY ("administeredById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
