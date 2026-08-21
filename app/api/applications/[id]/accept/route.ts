import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: applicationId } = await params;

    // Get the application with task info
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        task: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Check if user is the task creator
    if (application.task.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "You can only accept applications for your own tasks" },
        { status: 403 }
      );
    }

    // Check if task is still open
    if (application.task.status !== "open") {
      return NextResponse.json(
        { error: "This task is no longer accepting applications" },
        { status: 400 }
      );
    }

    // Update application to accepted and task to assigned
    // Also reject all other applications for this task
    await prisma.$transaction([
      // Accept this application
      prisma.application.update({
        where: { id: applicationId },
        data: { status: "accepted" },
      }),
      // Assign task to helper
      prisma.task.update({
        where: { id: application.taskId },
        data: {
          status: "assigned",
          assignedToId: application.helperId,
        },
      }),
      // Reject all other pending applications for this task
      prisma.application.updateMany({
        where: {
          taskId: application.taskId,
          id: { not: applicationId },
          status: "pending",
        },
        data: { status: "rejected" },
      }),
    ]);

    return NextResponse.json({ message: "Application accepted successfully" });
  } catch (error) {
    console.error("Error accepting application:", error);
    return NextResponse.json(
      { error: "Failed to accept application" },
      { status: 500 }
    );
  }
}
