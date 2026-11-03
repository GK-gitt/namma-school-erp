// ───────────────────────────────────────────────────────────────
// Full authentication setup (Node.js runtime).
//
// This takes the Edge-safe shared config (auth.config.ts) and adds the
// Credentials provider, which checks the password with bcrypt against the
// hashed value in the database via Prisma. Because bcrypt + Prisma need
// Node.js APIs, this file is only used on the server runtime — never the Edge.
// ───────────────────────────────────────────────────────────────
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { authConfig } from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
          schoolId: user.schoolId ?? null,
        };
      },
    }),
  ],
});
