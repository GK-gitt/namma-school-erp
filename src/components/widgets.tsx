// Premium B2B SaaS widgets — Linear/Vercel/Stripe aesthetic.
// Restrained palette, hairline borders, soft shadows, refined typography.
import type { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type Trend = { value: string; direction: "up" | "down" | "neutral" };

/**
 * A high-end metric card. Minimal, data-forward, with an optional trend.
 * Icon sits in a subtle muted square; the number is the hero.
 */
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
