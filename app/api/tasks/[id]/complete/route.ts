import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Only task creator or assigned helper can mark as complete
    if (
      task.createdById !== session.user.id &&
      task.assignedToId !== session.user.id
    ) {
      return NextResponse.json(
        { error: "You don't have permission to complete this task" },
        { status: 403 }
      );
    }

    // Update task status
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });

    // Increment helper's task count
    if (task.assignedToId) {
      await prisma.user.update({
        where: { id: task.assignedToId },
        data: {
          totalTasksAsHelper: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error completing task:", error);
    return NextResponse.json(
      { error: "Failed to complete task" },
      { status: 500 }
    );
  }
}
