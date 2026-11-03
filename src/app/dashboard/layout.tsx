// Shared shell for every page under /dashboard.
// Shows a sidebar whose links depend on the logged-in user's ROLE.
import Link from "next/link";
import { requireUser } from "@/lib/rbac";
import { logoutAction } from "./logout-action";
import type { Role } from "@prisma/client";

type NavItem = { href: string; label: string; roles: Role[] };

const NAV: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    roles: ["ADMIN", "TEACHER", "PARENT", "STUDENT"],
  },
  {
    href: "/dashboard/students",
    label: "Students",
    roles: ["ADMIN", "TEACHER"],
  },
  { href: "/dashboard/classes", label: "Classes", roles: ["ADMIN"] },
  {
    href: "/dashboard/attendance",
    label: "Attendance",
    roles: ["ADMIN", "TEACHER"],
  },
  { href: "/dashboard/fees", label: "Fees", roles: ["ADMIN"] },
  {
    href: "/dashboard/my-child",
    label: "My Child",
    roles: ["PARENT", "STUDENT"],
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const items = NAV.filter((i) => i.roles.includes(user.role));

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-5">
          <Link href="/dashboard" className="text-xl font-bold text-slate-900">
            School<span className="text-brand">Setu</span>
          </Link>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
            {user.role}
          </p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-100 px-4 py-4">
          <p className="truncate text-sm font-medium text-slate-700">
            {user.name}
          </p>
          <p className="truncate text-xs text-slate-400">{user.email}</p>
          <form action={logoutAction} className="mt-3">
            <button
              type="submit"
              className="w-full rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
