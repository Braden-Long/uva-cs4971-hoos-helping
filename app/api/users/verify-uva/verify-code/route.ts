import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Verification code is required" },
        { status: 400 }
      );
    }

    // Get user with verification code
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        uvaVerificationCode: true,
        uvaVerificationCodeExpires: true,
        uvaEmail: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if code exists
    if (!user.uvaVerificationCode || !user.uvaVerificationCodeExpires) {
      return NextResponse.json(
        { error: "No verification code found. Please request a new code." },
        { status: 400 }
      );
    }

    // Check if code has expired
    if (new Date() > user.uvaVerificationCodeExpires) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    // Check if code matches
    if (user.uvaVerificationCode !== code.trim()) {
      return NextResponse.json(
        { error: "Invalid verification code. Please try again." },
        { status: 400 }
      );
    }

    // Code is valid - mark user as UVA verified and clear the code
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        isUvaVerified: true,
        uvaVerificationCode: null,
        uvaVerificationCodeExpires: null,
      },
    });

    console.log("[UVA VERIFICATION] User verified:", session.user.id);

    return NextResponse.json({
      success: true,
      message: "UVA affiliation verified successfully!",
    });
  } catch (error) {
    console.error("[UVA VERIFICATION] Error verifying code:", error);
    return NextResponse.json(
      { error: "Failed to verify code. Please try again." },
      { status: 500 }
    );
  }
}
