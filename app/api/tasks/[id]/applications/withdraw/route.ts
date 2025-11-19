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

    // Find the application
    const application = await prisma.application.findUnique({
      where: {
        taskId_helperId: {
          taskId,
          helperId: session.user.id,
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Check if application has been accepted
    if (application.status === "accepted") {
      return NextResponse.json(
        { error: "Cannot withdraw an accepted application" },
        { status: 400 }
      );
    }

    // Delete the application
    await prisma.application.delete({
      where: {
        taskId_helperId: {
          taskId,
          helperId: session.user.id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error withdrawing application:", error);
    return NextResponse.json(
      { error: "Failed to withdraw application" },
      { status: 500 }
    );
  }
}
