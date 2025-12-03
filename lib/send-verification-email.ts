import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendVerificationRequestParams {
  identifier: string; // email
  url: string; // callback URL from NextAuth with token embedded
  provider: {
    from?: string;
  };
}

export async function sendVerificationRequest({
  identifier: email,
  url,
  provider,
}: SendVerificationRequestParams) {
  try {
    // Extract token and callback URL from the NextAuth URL
    const urlObj = new URL(url);
    const token = urlObj.searchParams.get("token");
    const callbackUrl =
      urlObj.searchParams.get("callbackUrl") || "/app/dashboard";

    if (!token) {
      throw new Error("No token found in verification URL");
    }

    // Create our custom verification URL that goes to the confirmation page
    const host = process.env.NEXTAUTH_URL || urlObj.origin;
    const verificationUrl = `${host}/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(callbackUrl)}`;

    console.log("[EMAIL] Sending verification email to:", email);
    console.log("[EMAIL] Verification URL:", verificationUrl);

    const fromEmail =
      provider.from ||
      process.env.RESEND_FROM_EMAIL ||
      "noreply@hooshelping.com";

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Sign in to Hoos Helping",
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
              <h2 style="margin-top: 0; color: #232D4B; font-size: 24px;">Sign in to your account</h2>

              <p style="font-size: 16px; color: #4b5563; margin: 20px 0;">
                Click the button below to securely sign in to Hoos Helping:
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}"
                   style="background-color: #E57200; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  Sign In to Hoos Helping
                </a>
              </div>

              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                If you didn't request this email, you can safely ignore it.
              </p>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 12px; color: #9ca3af; margin: 5px 0;">
                  This link will expire in 24 hours.
                </p>
                <p style="font-size: 12px; color: #9ca3af; margin: 5px 0;">
                  For security reasons, you'll need to click a confirmation button after opening the link.
                </p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 20px; padding: 20px;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                © ${new Date().getFullYear()} Hoos Helping. UVA Community Task Platform.
              </p>
            </div>
          </body>
        </html>
      `,
      text: `Sign in to Hoos Helping\n\nClick the link below to sign in:\n\n${verificationUrl}\n\nIf you didn't request this email, you can safely ignore it.\n\nThis link will expire in 24 hours.`,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
