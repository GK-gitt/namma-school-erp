// Rich dashboard widgets — colorful stat cards with icons & trends.
import type { ReactNode } from "react";

type Tone = "kesari" | "haldi" | "malnad" | "blue";

const TONES: Record<Tone, { bg: string; icon: string; ring: string }> = {
  kesari: { bg: "bg-kesari-50", icon: "text-kesari", ring: "ring-kesari/10" },
  haldi: { bg: "bg-haldi-50", icon: "text-haldi-dark", ring: "ring-haldi/20" },
  malnad: { bg: "bg-green-50", icon: "text-malnad", ring: "ring-malnad/10" },
  blue: { bg: "bg-blue-50", icon: "text-blue-600", ring: "ring-blue-200" },
};

export function StatWidget({
  icon,
  label,
  value,
  trend,
  tone = "kesari",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  trend?: string;
  tone?: Tone;
}) {
  const t = TONES[tone];
  return (
    <div
      className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ${t.ring} transition hover:-translate-y-0.5 hover:shadow-warm`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${t.bg} ${t.icon}`}
        >
          {icon}
        </div>
        {trend && (
          <span className="rounded-full bg-malnad/10 px-2 py-0.5 text-xs font-semibold text-malnad">
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

export function WidgetCard({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
