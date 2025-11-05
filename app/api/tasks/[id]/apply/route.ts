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
    const body = await req.json();
    const { message, proposedRate } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check if task exists and is open
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.status !== "open") {
      return NextResponse.json(
        { error: "This task is no longer accepting applications" },
        { status: 400 }
      );
    }

    // Check if user is trying to apply to their own task
    if (task.createdById === session.user.id) {
      return NextResponse.json(
        { error: "You cannot apply to your own task" },
        { status: 400 }
      );
    }

    // Check if user has already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        taskId_helperId: {
          taskId,
          helperId: session.user.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this task" },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        taskId,
        helperId: session.user.id,
        message,
        proposedRate: proposedRate ? parseFloat(proposedRate) : null,
      },
      include: {
        helper: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            skills: true,
            hasCar: true,
            hourlyRate: true,
            averageRating: true,
            totalTasksAsHelper: true,
          },
        },
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
