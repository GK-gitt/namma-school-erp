// Shared shell for every page under /dashboard — polished sidebar with icons.
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/rbac";
import { logoutAction } from "./logout-action";
import { Logo } from "@/components/logo";
import type { Role } from "@prisma/client";
import {
  LayoutDashboard,
  Users,
  School,
  CalendarCheck,
  Wallet,
  GraduationCap,
  Settings,
  LogOut,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  roles: Role[];
  icon: React.ReactNode;
};

const NAV: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    roles: ["ADMIN", "TEACHER", "PARENT", "STUDENT"],
    icon: <LayoutDashboard size={18} />,
  },
  {
    href: "/dashboard/students",
    label: "Students",
    roles: ["ADMIN", "TEACHER"],
    icon: <Users size={18} />,
  },
  {
    href: "/dashboard/classes",
    label: "Classes",
    roles: ["ADMIN"],
    icon: <School size={18} />,
  },
  {
    href: "/dashboard/attendance",
    label: "Attendance",
    roles: ["ADMIN", "TEACHER"],
    icon: <CalendarCheck size={18} />,
  },
  {
    href: "/dashboard/fees",
    label: "Fees",
    roles: ["ADMIN"],
    icon: <Wallet size={18} />,
  },
  {
    href: "/dashboard/my-child",
    label: "My Child",
    roles: ["PARENT", "STUDENT"],
    icon: <GraduationCap size={18} />,
  },
  {
    href: "/dashboard/settings",
    label: "School Settings",
    roles: ["ADMIN"],
    icon: <Settings size={18} />,
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  // The SaaS owner (SUPER_ADMIN) has no school — send them to the platform console.
  if (user.role === "SUPER_ADMIN") redirect("/platform");
  const items = NAV.filter((i) => i.roles.includes(user.role));

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-5">
          <Logo size={38} />
          <div className="leading-tight">
            <p className="font-extrabold text-slate-900">Namma School</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-kesari">
              {user.role}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-kesari-50 hover:text-kesari"
            >
              <span className="text-slate-400 group-hover:text-kesari">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-kannada-gradient text-sm font-bold text-white">
              {(user.name ?? "U").charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-700">
                {user.name}
              </p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-kesari-50 hover:text-kesari"
            >
              <LogOut size={16} /> Log out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
