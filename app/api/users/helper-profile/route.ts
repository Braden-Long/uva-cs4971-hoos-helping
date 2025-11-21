import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bio, skills, hasCar, hourlyRate } = body;

    // Validate required fields
    if (!bio || !skills || skills.length === 0) {
      return NextResponse.json(
        { error: "Bio and at least one skill are required" },
        { status: 400 }
      );
    }

    // Validate bio length (required for background verification)
    if (bio.trim().length < 20) {
      return NextResponse.json(
        {
          error:
            "Bio must be at least 20 characters long (required for background verification)",
        },
        { status: 400 }
      );
    }

    // Update user with helper profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bio,
        skills,
        hasCar: hasCar || false,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        isHelperProfileComplete: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating helper profile:", error);
    return NextResponse.json(
      { error: "Failed to update helper profile" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        bio: true,
        skills: true,
        hasCar: true,
        hourlyRate: true,
        isHelperProfileComplete: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching helper profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch helper profile" },
      { status: 500 }
    );
  }
}
