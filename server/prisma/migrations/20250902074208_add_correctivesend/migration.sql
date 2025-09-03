-- AlterTable
ALTER TABLE "public"."ChildDueVaccine" ADD COLUMN     "correctiveSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notificationSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "previousDueDate" TIMESTAMP(3);
