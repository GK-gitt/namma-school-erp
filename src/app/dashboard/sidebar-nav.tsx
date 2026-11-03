"use client";

// Sidebar navigation with active-state highlighting (Linear/Vercel style).
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "./layout";
import {
  LayoutDashboard,
  Users,
  School,
  CalendarCheck,
  Wallet,
  GraduationCap,
  Settings,
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard,
  Users,
  School,
  CalendarCheck,
  Wallet,
  GraduationCap,
  Settings,
};

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-0.5 px-3 py-2">
      {items.map((item) => {
        const Icon = ICONS[item.icon] ?? LayoutDashboard;
        // Exact match for /dashboard, prefix match for sub-pages.
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition ${
              active
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon size={17} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
