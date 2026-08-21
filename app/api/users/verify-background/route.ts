import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Prisma } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";
import {
  performBackgroundCheck,
  isProfileCompleteForVerification,
} from "@/lib/serpapi";

/**
 * POST /api/users/verify-background
 * Requests a background verification check for the authenticated user
 */
export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        zipCode: true,
        backgroundVerificationStatus: true,
        backgroundVerificationRequestedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if profile is complete
    const profileCheck = isProfileCompleteForVerification(user);
    if (!profileCheck.valid) {
      return NextResponse.json(
        {
          error: "Profile incomplete",
          message:
            "Please complete your profile before requesting verification.",
          missingFields: profileCheck.missingFields,
        },
        { status: 400 }
      );
    }

    // Check if there's already a pending verification
    if (
      user.backgroundVerificationStatus === "pending" &&
      user.backgroundVerificationRequestedAt
    ) {
      const hoursSinceRequest =
        (Date.now() -
          new Date(user.backgroundVerificationRequestedAt).getTime()) /
        (1000 * 60 * 60);

      if (hoursSinceRequest < 24) {
        return NextResponse.json(
          {
            error: "Verification already in progress",
            message:
              "A verification request is already pending. Please wait 24 hours before requesting again.",
          },
          { status: 429 }
        );
      }
    }

    // Update status to pending
    await prisma.user.update({
      where: { id: user.id },
      data: {
        backgroundVerificationStatus: "pending",
        backgroundVerificationRequestedAt: new Date(),
      },
    });

    // Perform background check with location
    const location =
      user.city && user.state ? `${user.city}, ${user.state}` : undefined;
    const result = await performBackgroundCheck(user.name!, location);

    if (!result.success) {
      // Update status to failed
      await prisma.user.update({
        where: { id: user.id },
        data: {
          backgroundVerificationStatus: "failed",
          backgroundVerificationCompletedAt: new Date(),
        },
      });

      return NextResponse.json(
        {
          error: "Verification failed",
          message: result.error || "Unable to complete background verification",
        },
        { status: 500 }
      );
    }

    // Determine verification result
    // For now, we'll mark as verified if we got results
    // You can add more sophisticated logic here based on what's found
    const isVerified = result.data && result.data.searchResults.length > 0;

    // Update user with verification results
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isBackgroundVerified: isVerified,
        backgroundVerificationStatus: isVerified ? "verified" : "failed",
        backgroundVerificationCompletedAt: new Date(),
        backgroundVerificationData: result.data as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({
      success: true,
      verified: isVerified,
      message: isVerified
        ? "Background verification completed successfully"
        : "Background verification could not confirm identity",
      summary: result.data?.summary,
    });
  } catch (error) {
    console.error("Background verification error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An error occurred during verification",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/users/verify-background
 * Gets the current background verification status
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        isBackgroundVerified: true,
        backgroundVerificationStatus: true,
        backgroundVerificationRequestedAt: true,
        backgroundVerificationCompletedAt: true,
        backgroundVerificationData: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      isVerified: user.isBackgroundVerified,
      status: user.backgroundVerificationStatus,
      requestedAt: user.backgroundVerificationRequestedAt,
      completedAt: user.backgroundVerificationCompletedAt,
      summary: user.backgroundVerificationData
        ? (user.backgroundVerificationData as Record<string, unknown>).summary
        : null,
    });
  } catch (error) {
    console.error("Error fetching verification status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
