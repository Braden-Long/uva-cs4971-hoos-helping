import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@/app/generated/prisma";
import { authConfig } from "./auth.config";
import Resend from "next-auth/providers/resend";
import { sendVerificationRequest } from "./lib/send-verification-email";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" }, // Changed to JWT for middleware compatibility
  ...authConfig,
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM_EMAIL || "noreply@hooshelping.com",
      maxAge: 24 * 60 * 60, // 24 hours (in seconds) - accounts for slow email delivery (e.g., Outlook)
      sendVerificationRequest, // Custom email sender with confirmation page to prevent link scanning
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      // Add custom fields to JWT token
      if (user?.id) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom fields to session from token
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
