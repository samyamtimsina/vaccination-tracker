/*
  Warnings:

  - You are about to drop the column `weight` on the `VaccinationRecord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sewaDartaNumber]` on the table `Child` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sewaDartaNumber]` on the table `Mother` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE "public".child_sewadartanumber_seq;
ALTER TABLE "public"."Child" ALTER COLUMN "sewaDartaNumber" SET DEFAULT nextval('"public".child_sewadartanumber_seq');
ALTER SEQUENCE "public".child_sewadartanumber_seq OWNED BY "public"."Child"."sewaDartaNumber";

-- AlterTable
CREATE SEQUENCE "public".mother_sewadartanumber_seq;
ALTER TABLE "public"."Mother" ALTER COLUMN "sewaDartaNumber" SET DEFAULT nextval('"public".mother_sewadartanumber_seq');
ALTER SEQUENCE "public".mother_sewadartanumber_seq OWNED BY "public"."Mother"."sewaDartaNumber";

-- AlterTable
ALTER TABLE "public"."VaccinationRecord" DROP COLUMN "weight";

-- CreateTable
CREATE TABLE "public"."WeightRecord" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "childId" TEXT NOT NULL,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeightRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Child_sewaDartaNumber_key" ON "public"."Child"("sewaDartaNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Mother_sewaDartaNumber_key" ON "public"."Mother"("sewaDartaNumber");

-- AddForeignKey
ALTER TABLE "public"."WeightRecord" ADD CONSTRAINT "WeightRecord_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeightRecord" ADD CONSTRAINT "WeightRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
