import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;

    // Check if task exists and user is the creator
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "You can only view applications for your own tasks" },
        { status: 403 }
      );
    }

    // Fetch applications
    const applications = await prisma.application.findMany({
      where: { taskId },
      include: {
        helper: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
            skills: true,
            hasCar: true,
            hourlyRate: true,
            averageRating: true,
            totalTasksAsHelper: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

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

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: "Application message is required" },
        { status: 400 }
      );
    }

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check if task is open
    if (task.status !== "open") {
      return NextResponse.json(
        { error: "This task is no longer accepting applications" },
        { status: 400 }
      );
    }

    // Check if user is the task creator
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
        status: "pending",
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
