// ───────────────────────────────────────────────────────────────
// Middleware — runs BEFORE every page request.
//
// It's a gatekeeper: if someone tries to open a protected page without
// being logged in, we bounce them to /login. This is a first layer; each
// page/action also re-checks (defense in depth).
// ───────────────────────────────────────────────────────────────
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Pages anyone can see without logging in.
const PUBLIC_PATHS = ["/", "/login", "/unauthorized"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Allow public pages, Next.js internals, and the health check.
  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/health");

  if (isPublic) return NextResponse.next();

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  // Run on everything except static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
