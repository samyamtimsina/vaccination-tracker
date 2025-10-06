/*
  Warnings:

  - You are about to drop the column `age` on the `Mother` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `Mother` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Mother" DROP COLUMN "age",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL;
