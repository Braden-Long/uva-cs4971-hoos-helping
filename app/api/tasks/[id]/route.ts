import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
            isUvaVerified: true,
            isBackgroundVerified: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            isUvaVerified: true,
            isBackgroundVerified: true,
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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existingTask = await prisma.task.findUnique({
      where: { id },
      select: { createdById: true },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (existingTask.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to update this task" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      category,
      location,
      budget,
      scheduledDate,
      categorySpecificData,
    } = body;

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      budget === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const budgetNum = parseFloat(budget);
    if (Number.isNaN(budgetNum) || budgetNum < 0) {
      return NextResponse.json(
        { error: "Budget must be a positive number" },
        { status: 400 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        category,
        location,
        budget: budgetNum,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        categorySpecificData: categorySpecificData ?? null,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
