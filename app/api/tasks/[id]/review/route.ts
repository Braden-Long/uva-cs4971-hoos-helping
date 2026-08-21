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

    const { id: taskId } = await params;
    const body = await req.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Get task details
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.status !== "completed") {
      return NextResponse.json(
        { error: "Can only review completed tasks" },
        { status: 400 }
      );
    }

    // Determine who is being reviewed
    let revieweeId: string;
    if (task.createdById === session.user.id) {
      // Task creator is reviewing the helper
      if (!task.assignedToId) {
        return NextResponse.json(
          { error: "No helper assigned to this task" },
          { status: 400 }
        );
      }
      revieweeId = task.assignedToId;
    } else if (task.assignedToId === session.user.id) {
      // Helper is reviewing the task creator
      revieweeId = task.createdById;
    } else {
      return NextResponse.json(
        { error: "You can only review tasks you're involved in" },
        { status: 403 }
      );
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        taskId_reviewerId: {
          taskId,
          reviewerId: session.user.id,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this task" },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        taskId,
        reviewerId: session.user.id,
        revieweeId,
        rating: parseInt(rating),
        comment: comment || null,
      },
    });

    // Update reviewee's average rating
    const allReviews = await prisma.review.findMany({
      where: { revieweeId },
      select: { rating: true },
    });

    const averageRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.user.update({
      where: { id: revieweeId },
      data: { averageRating },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

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

    // Check if user has already reviewed this task
    const review = await prisma.review.findUnique({
      where: {
        taskId_reviewerId: {
          taskId,
          reviewerId: session.user.id,
        },
      },
    });

    return NextResponse.json({ hasReviewed: !!review, review });
  } catch (error) {
    console.error("Error checking review:", error);
    return NextResponse.json(
      { error: "Failed to check review" },
      { status: 500 }
    );
  }
}
