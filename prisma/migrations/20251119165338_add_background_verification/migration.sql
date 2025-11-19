-- AlterTable
ALTER TABLE "User" ADD COLUMN     "backgroundVerificationCompletedAt" TIMESTAMP(3),
ADD COLUMN     "backgroundVerificationData" JSONB,
ADD COLUMN     "backgroundVerificationRequestedAt" TIMESTAMP(3),
ADD COLUMN     "backgroundVerificationStatus" TEXT,
ADD COLUMN     "isBackgroundVerified" BOOLEAN NOT NULL DEFAULT false;
