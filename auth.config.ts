import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnApp = nextUrl.pathname.startsWith("/app");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnApp || isOnAdmin) {
        if (isLoggedIn) {
          // Check admin role for admin routes
          if (isOnAdmin && auth.user.role !== "admin") {
            return Response.redirect(new URL("/app/dashboard", nextUrl));
          }
          return true;
        }
        return false; // Redirect unauthenticated users to login page
      }

      return true;
    },
  },
  providers: [], // Providers will be added in auth.ts
} satisfies NextAuthConfig;
