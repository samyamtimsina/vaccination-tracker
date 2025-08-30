/*
  Warnings:

  - The primary key for the `NotificationLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `citizenId` on the `NotificationLog` table. All the data in the column will be lost.
  - You are about to drop the column `doseNumber` on the `NotificationLog` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `NotificationLog` table. All the data in the column will be lost.
  - You are about to drop the column `vaccineType` on the `NotificationLog` table. All the data in the column will be lost.
  - Added the required column `childId` to the `NotificationLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `NotificationLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."NotificationLog" DROP CONSTRAINT "NotificationLog_citizenId_fkey";

-- AlterTable
ALTER TABLE "public"."NotificationLog" DROP CONSTRAINT "NotificationLog_pkey",
DROP COLUMN "citizenId",
DROP COLUMN "doseNumber",
DROP COLUMN "type",
DROP COLUMN "vaccineType",
ADD COLUMN     "childId" TEXT NOT NULL,
ADD COLUMN     "message" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "NotificationLog_id_seq";

-- AddForeignKey
ALTER TABLE "public"."NotificationLog" ADD CONSTRAINT "NotificationLog_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
