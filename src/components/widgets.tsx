// Premium B2B SaaS widgets — Linear/Vercel/Stripe aesthetic.
// Restrained palette, hairline borders, soft shadows, refined typography.
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type Trend = { value: string; direction: "up" | "down" | "neutral" };

/** A high-end metric card. Minimal, data-forward, with an optional trend. */
export function StatWidget({
  icon,
  label,
  value,
  sub,
  trend,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  trend?: Trend;
}) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_-12px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
          <span className="[&>svg]:h-[18px] [&>svg]:w-[18px]">{icon}</span>
        </div>
        {trend && <TrendBadge trend={trend} />}
      </div>
      <p className="mt-4 text-[13px] font-medium text-slate-500">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-[28px] font-semibold leading-none tracking-tight text-slate-900">
          {value}
        </p>
        {sub && (
          <span className="text-xs font-medium text-slate-400">{sub}</span>
        )}
      </div>
    </div>
  );
}

function TrendBadge({ trend }: { trend: Trend }) {
  if (trend.direction === "neutral") {
    return (
      <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-inset ring-slate-200">
        {trend.value}
      </span>
    );
  }
  const up = trend.direction === "up";
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
        up
          ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
          : "bg-rose-50 text-rose-700 ring-rose-100"
      }`}
    >
      {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
      {trend.value}
    </span>
  );
}

/** A clean container for charts / sections. */
export function WidgetCard({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/** A compact progress bar with a label + value (e.g. fee collection per class). */
export function ProgressRow({
  label,
  pct,
  right,
  tone = "indigo",
}: {
  label: string;
  pct: number;
  right?: string;
  tone?: "indigo" | "emerald" | "amber" | "rose";
}) {
  const bar: Record<string, string> = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[13px]">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-400">{right ?? `${pct}%`}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${bar[tone]} transition-all`}
          style={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

/** A single activity-feed row. */
export function ActivityItem({
  icon,
  title,
  meta,
  amount,
  tone = "slate",
}: {
  icon: ReactNode;
  title: string;
  meta: string;
  amount?: string;
  tone?: "slate" | "emerald" | "indigo";
}) {
  const bg: Record<string, string> = {
    slate: "bg-slate-50 text-slate-500",
    emerald: "bg-emerald-50 text-emerald-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg[tone]} [&>svg]:h-4 [&>svg]:w-4`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-slate-800">
          {title}
        </p>
        <p className="truncate text-xs text-slate-400">{meta}</p>
      </div>
      {amount && (
        <span className="shrink-0 text-[13px] font-semibold text-slate-700">
          {amount}
        </span>
      )}
    </div>
  );
}

/** A quick-action tile (links to a page). */
export function QuickAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:shadow-sm"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white transition group-hover:scale-105 [&>svg]:h-[18px] [&>svg]:w-[18px]">
        {icon}
      </div>
      <span className="text-[13px] font-medium text-slate-700">{label}</span>
    </Link>
  );
}

/** A circular progress ring (for a headline % like collection rate). */
export function ProgressRing({
  pct,
  label,
  color = "#4f46e5",
}: {
  pct: number;
  label: string;
  color?: string;
}) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(Math.max(pct, 0), 100) / 100) * circ;
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="8"
          />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold tracking-tight text-slate-900">
            {pct}%
          </span>
        </div>
      </div>
      <span className="mt-2 text-xs font-medium text-slate-500">{label}</span>
    </div>
  );
}
