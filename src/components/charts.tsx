"use client";

// Charts for the dashboard, built on Recharts. Client components because
// charts render in the browser.
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
} from "recharts";

const KESARI = "#E63329";
const HALDI = "#FFB300";
const MALNAD = "#1B7A43";

// Attendance trend over recent days (area chart).
export function AttendanceTrend({
  data,
}: {
  data: { day: string; present: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={KESARI} stopOpacity={0.4} />
            <stop offset="100%" stopColor={KESARI} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="present"
          stroke={KESARI}
          strokeWidth={2.5}
          fill="url(#attGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Fee collection split (donut chart).
export function FeeDonut({ paid, pending }: { paid: number; pending: number }) {
  const data = [
    { name: "Collected", value: paid },
    { name: "Pending", value: pending },
  ];
  const COLORS = [MALNAD, HALDI];
  const empty = paid === 0 && pending === 0;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={empty ? [{ name: "No data", value: 1 }] : data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
        >
          {(empty ? ["#e2e8f0"] : COLORS).map((c, i) => (
            <Cell key={i} fill={c} />
          ))}
        </Pie>
        {!empty && (
          <Legend verticalAlign="bottom" height={24} iconType="circle" />
        )}
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Students per class (bar chart).
export function ClassBars({
  data,
}: {
  data: { name: string; students: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip cursor={{ fill: "#fef2f1" }} />
        <Bar dataKey="students" fill={HALDI} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
