// Dashboard shell — premium B2B SaaS layout (Linear/Vercel/Stripe style).
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/rbac";
import { logoutAction } from "./logout-action";
import { SidebarNav } from "./sidebar-nav";
import { Logo } from "@/components/logo";
import type { Role } from "@prisma/client";

export type NavItem = {
  href: string;
  label: string;
  roles: Role[];
  icon: string;
};

const NAV: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    roles: ["ADMIN", "TEACHER", "PARENT", "STUDENT"],
    icon: "LayoutDashboard",
  },
  {
    href: "/dashboard/students",
    label: "Students",
    roles: ["ADMIN", "TEACHER"],
    icon: "Users",
  },
  {
    href: "/dashboard/classes",
    label: "Classes",
    roles: ["ADMIN"],
    icon: "School",
  },
  {
    href: "/dashboard/attendance",
    label: "Attendance",
    roles: ["ADMIN", "TEACHER"],
    icon: "CalendarCheck",
  },
  { href: "/dashboard/fees", label: "Fees", roles: ["ADMIN"], icon: "Wallet" },
  {
    href: "/dashboard/my-child",
    label: "My Child",
    roles: ["PARENT", "STUDENT"],
    icon: "GraduationCap",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    roles: ["ADMIN"],
    icon: "Settings",
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  if (user.role === "SUPER_ADMIN") redirect("/platform");
  const items = NAV.filter((i) => i.roles.includes(user.role));

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-4">
          <Logo size={30} />
          <span className="text-[15px] font-semibold tracking-tight text-slate-900">
            Namma School
          </span>
        </div>

        {/* Nav (client component for active-state highlighting) */}
        <SidebarNav items={items} />

        {/* User footer */}
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {(user.name ?? "U").charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-slate-800">
                {user.name}
              </p>
              <p className="truncate text-[11px] text-slate-400">
                {user.email}
              </p>
            </div>
          </div>
          <form action={logoutAction} className="mt-1">
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            {user.role === "ADMIN"
              ? "Administrator"
              : user.role.charAt(0) + user.role.slice(1).toLowerCase()}
          </span>
          <span className="rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-inset ring-slate-200">
            Namma Demo School
          </span>
        </header>
        <main className="flex-1 overflow-y-auto px-8 py-7">{children}</main>
      </div>
    </div>
  );
}
