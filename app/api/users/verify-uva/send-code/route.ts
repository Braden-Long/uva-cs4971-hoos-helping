import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/app/generated/prisma";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { uvaEmail } = await request.json();

    // Validate UVA email
    if (!uvaEmail || !uvaEmail.toLowerCase().endsWith("@virginia.edu")) {
      return NextResponse.json(
        { error: "Please provide a valid @virginia.edu email address" },
        { status: 400 }
      );
    }

    // Check if this UVA email is already verified by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        uvaEmail: uvaEmail.toLowerCase(),
        isUvaVerified: true,
        NOT: {
          id: session.user.id,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "This UVA email is already verified by another account" },
        { status: 400 }
      );
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save code to database
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        uvaEmail: uvaEmail.toLowerCase(),
        uvaVerificationCode: code,
        uvaVerificationCodeExpires: expiresAt,
        isUvaVerified: false, // Reset verification status
      },
    });

    // Send email with code
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "noreply@hooshelping.com";

    await resend.emails.send({
      from: fromEmail,
      to: uvaEmail,
      subject: "Your UVA Verification Code - Hoos Helping",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #E57200 0%, #232D4B 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Hoos Helping</h1>
            </div>

            <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <h2 style="margin-top: 0; color: #232D4B; font-size: 24px;">UVA Verification Code</h2>

              <p style="font-size: 16px; color: #4b5563; margin: 20px 0;">
                Enter this code on your profile page to verify your UVA affiliation:
              </p>

              <div style="background: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; margin: 30px 0;">
                <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #E57200; font-family: 'Courier New', monospace;">
                  ${code}
                </div>
              </div>

              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                This code will expire in <strong>10 minutes</strong>.
              </p>

              <p style="font-size: 14px; color: #6b7280;">
                If you didn't request this code, you can safely ignore this email.
              </p>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  © ${new Date().getFullYear()} Hoos Helping. UVA Community Task Platform.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Your UVA Verification Code for Hoos Helping\n\nCode: ${code}\n\nEnter this code on your profile page to verify your UVA affiliation.\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, you can safely ignore this email.`,
    });

    console.log("[UVA VERIFICATION] Code sent to:", uvaEmail);

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your UVA email",
    });
  } catch (error) {
    console.error("[UVA VERIFICATION] Error sending code:", error);
    return NextResponse.json(
      { error: "Failed to send verification code. Please try again." },
      { status: 500 }
    );
  }
}
