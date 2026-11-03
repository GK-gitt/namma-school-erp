// ───────────────────────────────────────────────────────────────
// Prisma Client — our single connection to the database.
//
// In development, Next.js reloads code a lot. Without this guard we'd
// open a new DB connection on every reload and run out. So we cache one
// client on the global object. Standard Prisma + Next.js best practice.
// ───────────────────────────────────────────────────────────────
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
