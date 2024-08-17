/*
  Warnings:

  - Added the required column `statusFormatted` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "statusFormatted" TEXT NOT NULL,
ADD COLUMN     "userEmail" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;
