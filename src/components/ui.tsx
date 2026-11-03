// Shared UI primitives — premium B2B SaaS aesthetic (Linear/Vercel/Stripe).
// Hairline borders, soft shadows, refined type. Used across all inner pages.
import Link from "next/link";
import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">
        {title}
      </h1>
      {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <p className="text-[13px] font-medium text-slate-500">{label}</p>
      <p className="mt-1.5 text-[26px] font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </Card>
  );
}

export function Button({
  children,
  type = "button",
  variant = "primary",
}: {
  children: ReactNode;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50";
  return (
    <button type={type} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-slate-800"
    >
      {children}
    </Link>
  );
}

export function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60">
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  No records yet.
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} className="transition hover:bg-slate-50/60">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="whitespace-nowrap px-4 py-3 text-[13px] text-slate-700"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Badge({
  children,
  color = "slate",
}: {
  children: ReactNode;
  color?: string;
}) {
  const map: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    red: "bg-rose-50 text-rose-700 ring-rose-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    blue: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    slate: "bg-slate-50 text-slate-600 ring-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${map[color]}`}
    >
      {children}
    </span>
  );
}
