/*
  Warnings:

  - Added the required column `billingReason` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentStatus` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "billingReason" TEXT NOT NULL,
ADD COLUMN     "paymentStatus" TEXT NOT NULL;
