import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
        isHelperProfileComplete: true,
        createdAt: true,
        reviewsReceived: {
          include: {
            reviewer: {
              select: {
                name: true,
                email: true,
              },
            },
            task: {
              select: {
                title: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
