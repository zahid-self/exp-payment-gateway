/*
  Warnings:

  - You are about to drop the column `currentPeriodEnd` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_customerId_key";

-- DropIndex
DROP INDEX "User_subscriptionId_key";

-- DropIndex
DROP INDEX "User_variantId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "currentPeriodEnd",
DROP COLUMN "customerId",
DROP COLUMN "subscriptionId",
DROP COLUMN "variantId";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerId" TEXT,
    "subscriptionId" TEXT,
    "planId" TEXT NOT NULL,
    "variantId" INTEGER,
    "status" TEXT NOT NULL,
    "renewsAt" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_id_key" ON "Subscription"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_customerId_key" ON "Subscription"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscriptionId_key" ON "Subscription"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_variantId_key" ON "Subscription"("variantId");
