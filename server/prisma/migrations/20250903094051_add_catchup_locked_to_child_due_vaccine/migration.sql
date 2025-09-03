-- AlterTable
ALTER TABLE "public"."ChildDueVaccine" ADD COLUMN     "isCatchUp" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Dose" ADD COLUMN     "isPrimary" BOOLEAN DEFAULT true;
