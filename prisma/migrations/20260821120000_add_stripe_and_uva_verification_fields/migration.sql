-- Backfills columns that were added to schema.prisma without a matching
-- migration (most likely via `prisma db push` during development). Production
-- runs `prisma migrate deploy`, which only applies migration files, so these
-- columns never existed there and every `prisma.user.findUnique()` threw --
-- which broke sign-in entirely, since the NextAuth Prisma adapter looks the
-- user up before sending a magic link.
--
-- Generated with `prisma migrate diff` against the live database. Purely
-- additive: no drops, no type changes, no data loss. The NOT NULL columns
-- carry defaults, so existing rows backfill cleanly.

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "stripePaymentIntentId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeAccountId" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "uvaEmail" TEXT,
ADD COLUMN     "uvaVerificationCode" TEXT,
ADD COLUMN     "uvaVerificationCodeExpires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Task_stripePaymentIntentId_key" ON "Task"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeAccountId_key" ON "User"("stripeAccountId");
