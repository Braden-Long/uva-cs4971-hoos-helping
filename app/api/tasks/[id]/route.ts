import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    const task = await prisma.task.findUnique({
      where: {
        id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check user relationship to task
    let isOwner = false;
    let isAssigned = false;
    let hasApplied = false;

    if (session?.user?.id) {
      isOwner = task.createdById === session.user.id;
      isAssigned = task.assignedToId === session.user.id;

      // Check if user has applied
      const application = await prisma.application.findUnique({
        where: {
          taskId_helperId: {
            taskId: task.id,
            helperId: session.user.id,
          },
        },
      });

      hasApplied = !!application;
    }

    return NextResponse.json({
      ...task,
      isOwner,
      isAssigned,
      hasApplied,
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}
