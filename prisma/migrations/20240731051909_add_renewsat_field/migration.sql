/*
  Warnings:

  - Made the column `subscriptionId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "renewsAt" TIMESTAMP(3),
ALTER COLUMN "subscriptionId" SET NOT NULL;
