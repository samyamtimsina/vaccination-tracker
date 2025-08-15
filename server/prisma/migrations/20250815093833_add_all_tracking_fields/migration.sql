-- AlterTable
ALTER TABLE "public"."Child" ADD COLUMN     "verifiedById" INTEGER;

-- AlterTable
ALTER TABLE "public"."VaccinationRecord" ADD COLUMN     "administeredById" INTEGER;

-- AlterTable
ALTER TABLE "public"."WeightRecord" ADD COLUMN     "administeredById" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Child" ADD CONSTRAINT "Child_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VaccinationRecord" ADD CONSTRAINT "VaccinationRecord_administeredById_fkey" FOREIGN KEY ("administeredById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeightRecord" ADD CONSTRAINT "WeightRecord_administeredById_fkey" FOREIGN KEY ("administeredById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
