/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "zipCode" TEXT;
