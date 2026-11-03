// ───────────────────────────────────────────────────────────────
// Authentication configuration (Auth.js / NextAuth v5).
//
// This handles: "who is logging in, is their password correct, and what
// role do they have?" Passwords are checked against the HASHED version in
// the DB using bcrypt — we never compare plain text.
// ───────────────────────────────────────────────────────────────
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import type { Role } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Validate the shape of the input (never trust the browser).
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // 2. Find the user by email.
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) return null;

        // 3. Compare the given password to the stored HASH.
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        // 4. Return the minimal info we want in the session token.
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
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
});
