"use client";

// Charts for the dashboard — premium B2B SaaS styling (restrained, crisp).
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

// Refined palette: a single indigo accent + muted neutrals.
const ACCENT = "#4f46e5"; // indigo-600
const ACCENT_SOFT = "#6366f1";
const EMERALD = "#059669";
const SLATE = "#e2e8f0";

const tooltipStyle = {
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  boxShadow: "0 8px 24px -12px rgba(0,0,0,0.15)",
  fontSize: 12,
  padding: "8px 12px",
};

export function AttendanceTrend({
  data,
}: {
  data: { day: string; present: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart
        data={data}
        margin={{ top: 8, right: 8, left: -22, bottom: 0 }}
      >
        <defs>
          <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity={0.18} />
            <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f1f5f9"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          width={32}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Area
          type="monotone"
          dataKey="present"
          stroke={ACCENT}
          strokeWidth={2}
          fill="url(#attGrad)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function FeeDonut({ paid, pending }: { paid: number; pending: number }) {
  const data = [
    { name: "Collected", value: paid },
    { name: "Pending", value: pending },
  ];
  const COLORS = [EMERALD, SLATE];
  const empty = paid === 0 && pending === 0;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={empty ? [{ name: "No data", value: 1 }] : data}
          dataKey="value"
          nameKey="name"
          innerRadius={62}
          outerRadius={88}
          paddingAngle={2}
          stroke="none"
        >
          {(empty ? ["#f1f5f9"] : COLORS).map((c, i) => (
            <Cell key={i} fill={c} />
          ))}
        </Pie>
        {!empty && (
          <Legend
            verticalAlign="bottom"
            height={28}
            iconType="circle"
            iconSize={8}
            formatter={(v) => (
              <span className="text-xs text-slate-500">{v}</span>
            )}
          />
        )}
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ClassBars({
  data,
}: {
  data: { name: string; students: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f1f5f9"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          width={32}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f8fafc" }} />
        <Bar
          dataKey="students"
          fill={ACCENT_SOFT}
          radius={[4, 4, 0, 0]}
          maxBarSize={44}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
