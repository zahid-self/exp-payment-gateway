-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "billingReason" DROP NOT NULL,
ALTER COLUMN "paymentStatus" DROP NOT NULL;
