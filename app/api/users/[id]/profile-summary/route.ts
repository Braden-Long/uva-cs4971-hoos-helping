import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/users/[id]/profile-summary
 * Get a user's profile summary including recent tasks and reviews
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // Fetch user basic info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        isUvaVerified: true,
        isBackgroundVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get total tasks posted by this user
    const totalTasksPosted = await prisma.task.count({
      where: { createdById: userId },
    });

    // Get recent completed tasks posted by this user
    const recentCompletedTasks = await prisma.task.findMany({
      where: {
        createdById: userId,
        status: "completed",
      },
      select: {
        id: true,
        title: true,
        category: true,
        budget: true,
        completedAt: true,
      },
      orderBy: {
        completedAt: "desc",
      },
      take: 3,
    });

    // Get reviews for this user's tasks
    const reviews = await prisma.review.findMany({
      where: {
        task: {
          createdById: userId,
        },
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        reviewer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });

    // Calculate average rating
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        : null;

    return NextResponse.json({
      ...user,
      totalTasksPosted,
      averageRating,
      recentCompletedTasks: recentCompletedTasks.filter(
        (task) => task.completedAt !== null
      ),
      recentReviews: reviews,
    });
  } catch (error) {
    console.error("Error fetching user profile summary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
