// ───────────────────────────────────────────────────────────────
// Health Check endpoint:  GET /api/health
//
// Uptime monitors (and you!) can hit this to confirm the app AND the
// database are alive. Returns 200 if healthy, 503 if the DB is down.
// This is your "is it up?" probe — like a readiness check in k8s.
// ───────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // never cache a health check

export async function GET() {
  try {
    // Simple query to prove the DB connection works.
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      {
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
