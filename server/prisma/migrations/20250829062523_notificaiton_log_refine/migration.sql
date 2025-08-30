/*
  Warnings:

  - The primary key for the `NotificationLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `NotificationLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "public"."NotificationLog" DROP CONSTRAINT "NotificationLog_childId_fkey";

-- AlterTable
ALTER TABLE "public"."NotificationLog" DROP CONSTRAINT "NotificationLog_pkey",
ADD COLUMN     "motherId" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "childId" DROP NOT NULL,
ADD CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."NotificationLog" ADD CONSTRAINT "NotificationLog_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."Child"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NotificationLog" ADD CONSTRAINT "NotificationLog_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "public"."Mother"("id") ON DELETE SET NULL ON UPDATE CASCADE;
