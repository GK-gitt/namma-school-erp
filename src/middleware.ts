// ───────────────────────────────────────────────────────────────
// Middleware — runs BEFORE every request, on the Edge Runtime.
//
// It uses ONLY the Edge-safe config (no bcrypt/Prisma). The `authorized`
// callback in auth.config.ts decides who may access protected pages; if not
// allowed, Auth.js automatically redirects to /login. Each page/action also
// re-checks the role server-side (defense in depth).
// ───────────────────────────────────────────────────────────────
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
  // The `authorized` callback already decided access. Nothing else to do here;
  // returning undefined lets Auth.js apply its redirect logic.
  return;
});

export const config = {
  // Run on everything except static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
