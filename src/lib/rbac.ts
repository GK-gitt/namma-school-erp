// ───────────────────────────────────────────────────────────────
// RBAC — Role-Based Access Control helpers.
//
// These functions are the SECURITY GATE. We call them at the top of every
// protected action/page. If the user isn't allowed, we stop immediately.
// This runs on the SERVER, so it can't be bypassed by the browser.
// ───────────────────────────────────────────────────────────────
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";

/** Get the current logged-in user, or null. */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Require ANY logged-in user. Redirects to /login if not signed in. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Require the user to have one of the allowed roles. */
export async function requireRole(allowed: Role[]) {
  const user = await requireUser();
  if (!allowed.includes(user.role)) {
    redirect("/unauthorized");
  }
  return user;
}

/** Convenience checks. */
export function isAdmin(role: Role) {
  return role === "ADMIN";
}
export function isTeacher(role: Role) {
  return role === "TEACHER";
}
