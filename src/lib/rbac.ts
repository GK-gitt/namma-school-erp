// ───────────────────────────────────────────────────────────────
// RBAC + TENANT guards — the SECURITY GATE for multi-tenant SaaS.
//
// We call these at the top of every protected action/page. They enforce:
//   1. the user is logged in,
//   2. the user has an allowed role,
//   3. (for tenant data) the user's schoolId is known and used to scope
//      every query — so School A can never see School B's data.
// All of this runs on the SERVER and can't be bypassed by the browser.
// ───────────────────────────────────────────────────────────────
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Require ANY logged-in user. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Require one of the allowed roles. */
export async function requireRole(allowed: Role[]) {
  const user = await requireUser();
  if (!allowed.includes(user.role)) {
    redirect("/unauthorized");
  }
  return user;
}

/**
 * Require a user who belongs to a school, and return their schoolId.
 * Use this for ALL tenant-scoped data access. SUPER_ADMIN has no school,
 * so they are sent to the platform console instead.
 */
export async function requireSchool(
  allowed: Role[] = ["ADMIN", "TEACHER", "PARENT", "STUDENT"],
) {
  const user = await requireRole(allowed);
  if (!user.schoolId) {
    // SUPER_ADMIN or a misconfigured account — not a tenant user.
    redirect("/platform");
  }
  return { user, schoolId: user.schoolId };
}

export function isAdmin(role: Role) {
  return role === "ADMIN";
}
export function isTeacher(role: Role) {
  return role === "TEACHER";
}
export function isSuperAdmin(role: Role) {
  return role === "SUPER_ADMIN";
}
