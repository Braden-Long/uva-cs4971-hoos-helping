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
        { error: "You can only reject applications for your own tasks" },
        { status: 403 }
      );
    }

    // Update application status to rejected
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "rejected" },
    });

    return NextResponse.json({ message: "Application rejected successfully" });
  } catch (error) {
    console.error("Error rejecting application:", error);
    return NextResponse.json(
      { error: "Failed to reject application" },
      { status: 500 }
    );
  }
}
