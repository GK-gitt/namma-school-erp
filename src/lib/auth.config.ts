// ───────────────────────────────────────────────────────────────
// Edge-safe Auth config (NO bcrypt, NO Prisma).
//
// WHY THIS FILE EXISTS:
// Next.js middleware runs on the "Edge Runtime" — a lightweight environment
// that does NOT support Node.js APIs that bcrypt and Prisma need. So we split
// the config: this file has only the parts safe for the Edge (callbacks,
// pages, route-authorization), and auth.ts adds the password-checking provider
// (which uses bcrypt/Prisma) for the normal Node.js server runtime.
// This is the official Auth.js v5 pattern.
// ───────────────────────────────────────────────────────────────
import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

// Pages anyone can see without logging in.
const PUBLIC_PATHS = ["/", "/login", "/unauthorized"];

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  // Providers are added in auth.ts (they need bcrypt/Prisma = Node runtime).
  providers: [],
  callbacks: {
    // Gatekeeper used by the middleware: decide if a request is allowed.
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;

      const isPublic =
        PUBLIC_PATHS.includes(pathname) ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/api/health");

      if (isPublic) return true;
      // For protected pages, allow only if logged in.
      return isLoggedIn;
    },
    // Put the role + id into the token so we can check them cheaply later.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: Role }).role;
      }
      return token;
    },
    // Expose role + id on the session object used throughout the app.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
