-- AlterTable
ALTER TABLE "public"."Child" ADD COLUMN     "nextDueDate" TIMESTAMP(3),
ADD COLUMN     "nextDueDoseNumber" INTEGER,
ADD COLUMN     "nextDueVaccine" TEXT;
