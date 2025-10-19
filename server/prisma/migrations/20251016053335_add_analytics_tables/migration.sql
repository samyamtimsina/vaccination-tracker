-- AlterTable
ALTER TABLE "public"."ChildAnalyticsFact" ADD COLUMN     "municipality" INTEGER,
ADD COLUMN     "province" INTEGER,
ALTER COLUMN "ward" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."GrowthAnalyticsFact" ADD COLUMN     "municipality" INTEGER,
ADD COLUMN     "province" INTEGER,
ALTER COLUMN "ward" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MotherAnalyticsFact" ADD COLUMN     "municipality" INTEGER,
ADD COLUMN     "province" INTEGER,
ALTER COLUMN "ward" DROP NOT NULL;
