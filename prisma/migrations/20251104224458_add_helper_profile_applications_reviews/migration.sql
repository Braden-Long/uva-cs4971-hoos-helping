-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "categorySpecificData" JSONB,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "scheduledDate" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'open';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "averageRating" DOUBLE PRECISION,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "hasCar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hourlyRate" DOUBLE PRECISION,
ADD COLUMN     "isHelperProfileComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "totalTasksAsHelper" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "helperId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "proposedRate" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "revieweeId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_taskId_helperId_key" ON "Application"("taskId", "helperId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_taskId_reviewerId_key" ON "Review"("taskId", "reviewerId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_helperId_fkey" FOREIGN KEY ("helperId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
