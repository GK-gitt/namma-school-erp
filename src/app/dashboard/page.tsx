// Dashboard — premium B2B SaaS, rich multi-widget command center.
import { requireSchool } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { formatINR, startOfToday, formatDate } from "@/lib/format";
import {
  StatWidget,
  WidgetCard,
  ProgressRow,
  ActivityItem,
  QuickAction,
  ProgressRing,
} from "@/components/widgets";
import { AttendanceTrend, FeeDonut, ClassBars } from "@/components/charts";
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Percent,
  School,
  CalendarDays,
  UserPlus,
  Wallet,
  Receipt,
  TrendingUp,
} from "lucide-react";

export default async function DashboardPage() {
  const { user, schoolId } = await requireSchool();
  if (user.role === "ADMIN")
    return <AdminDashboard schoolId={schoolId} name={user.name ?? "Admin"} />;
  if (user.role === "TEACHER")
    return (
      <TeacherDashboard
        schoolId={schoolId}
        id={user.id}
        name={user.name ?? "Teacher"}
      />
    );
  return (
    <FamilyDashboard
      schoolId={schoolId}
      id={user.id}
      role={user.role}
      name={user.name ?? ""}
    />
  );
}

// ── ADMIN ──────────────────────────────────────────────────────
async function AdminDashboard({
  schoolId,
  name,
}: {
  schoolId: string;
  name: string;
}) {
  const [
    students,
    classes,
    activeStudents,
    todayPresent,
    totalPaid,
    classList,
    recentPayments,
    maleCount,
    femaleCount,
  ] = await Promise.all([
    prisma.student.count({ where: { schoolId, isActive: true } }),
    prisma.schoolClass.count({ where: { schoolId } }),
    prisma.student.count({ where: { schoolId, isActive: true } }),
    prisma.attendance.count({
      where: { schoolId, status: "PRESENT", date: { gte: startOfToday() } },
    }),
    prisma.feePayment.aggregate({
      where: { schoolId },
      _sum: { amount: true },
    }),
    prisma.schoolClass.findMany({
      where: { schoolId },
      include: { _count: { select: { students: true } }, feeStructure: true },
    }),
    prisma.feePayment.findMany({
      where: { schoolId },
      include: { student: true },
      orderBy: { paidOn: "desc" },
      take: 5,
    }),
    prisma.student.count({
      where: { schoolId, isActive: true, gender: "Male" },
    }),
    prisma.student.count({
      where: { schoolId, isActive: true, gender: "Female" },
    }),
  ]);

  const trend = await buildAttendanceTrend(schoolId);
  const paid = Number(totalPaid._sum.amount ?? 0);
  const expectedTotal = classList.reduce((t, c) => {
    const per = c.feeStructure.reduce((s, f) => s + Number(f.amount), 0);
    return t + per * c._count.students;
  }, 0);
  const pending = Math.max(expectedTotal - paid, 0);
  const collectionRate =
    expectedTotal > 0 ? Math.round((paid / expectedTotal) * 100) : 0;
  const attendanceRate =
    activeStudents > 0 ? Math.round((todayPresent / activeStudents) * 100) : 0;

  const classBars = classList.map((c) => ({
    name: `${c.name.replace("Class ", "")}-${c.section}`,
    students: c._count.students,
  }));

  // Per-class fee collection % (demo: compare paid pool proportionally isn't exact,
  // so we show expected-per-class as the bar — a useful at-a-glance widget).
  const classProgress = classList.slice(0, 5).map((c) => {
    const per = c.feeStructure.reduce((s, f) => s + Number(f.amount), 0);
    const classExpected = per * c._count.students;
    const pct =
      expectedTotal > 0 ? Math.round((classExpected / expectedTotal) * 100) : 0;
    return {
      label: `${c.name} - ${c.section}`,
      pct,
      right: formatINR(classExpected),
    };
  });

  return (
    <>
      <Header name={name} subtitle="School overview" />

      {/* Quick actions */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickAction
          href="/dashboard/students/new"
          icon={<UserPlus />}
          label="Add Student"
        />
        <QuickAction
          href="/dashboard/attendance"
          icon={<CalendarCheck />}
          label="Mark Attendance"
        />
        <QuickAction
          href="/dashboard/fees"
          icon={<Wallet />}
          label="Record Payment"
        />
        <QuickAction
          href="/dashboard/classes"
          icon={<School />}
          label="Manage Classes"
        />
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatWidget
          icon={<Users />}
          label="Total Students"
          value={String(students)}
          trend={{ value: "Active", direction: "neutral" }}
        />
        <StatWidget
          icon={<Percent />}
          label="Fee Collection Rate"
          value={`${collectionRate}%`}
          sub={formatINR(paid)}
          trend={{
            value: `${collectionRate}%`,
            direction: collectionRate >= 60 ? "up" : "down",
          }}
        />
        <StatWidget
          icon={<CalendarCheck />}
          label="Today's Attendance"
          value={`${attendanceRate}%`}
          sub={`${todayPresent}/${activeStudents}`}
          trend={{
            value: `${attendanceRate}%`,
            direction: attendanceRate >= 75 ? "up" : "down",
          }}
        />
        <StatWidget icon={<School />} label="Classes" value={String(classes)} />
      </div>

      {/* Charts row */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WidgetCard
            title="Attendance"
            subtitle="Present students, last 7 days"
          >
            <AttendanceTrend data={trend} />
          </WidgetCard>
        </div>
        <WidgetCard title="Fee Collection" subtitle="Collected vs pending">
          <FeeDonut paid={paid} pending={pending} />
        </WidgetCard>
      </div>

      {/* Rich widgets row: collection progress + recent activity + snapshot */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <WidgetCard
          title="Fee share by class"
          subtitle="Expected fee distribution"
        >
          <div className="space-y-4">
            {classProgress.length === 0 ? (
              <p className="text-sm text-slate-400">No classes yet.</p>
            ) : (
              classProgress.map((c, i) => (
                <ProgressRow
                  key={c.label}
                  label={c.label}
                  pct={c.pct}
                  right={c.right}
                  tone={
                    (["indigo", "emerald", "amber", "rose", "indigo"] as const)[
                      i
                    ]
                  }
                />
              ))
            )}
          </div>
        </WidgetCard>

        <WidgetCard title="Recent payments" subtitle="Latest fee collections">
          <div className="divide-y divide-slate-100">
            {recentPayments.length === 0 ? (
              <p className="py-4 text-sm text-slate-400">No payments yet.</p>
            ) : (
              recentPayments.map((p) => (
                <ActivityItem
                  key={p.id}
                  icon={<Receipt />}
                  tone="emerald"
                  title={`${p.student.firstName} ${p.student.lastName}`}
                  meta={`${p.mode} · ${formatDate(p.paidOn)}`}
                  amount={formatINR(Number(p.amount))}
                />
              ))
            )}
          </div>
        </WidgetCard>

        <WidgetCard title="Today's snapshot">
          <div className="flex flex-col items-center gap-4">
            <ProgressRing
              pct={collectionRate}
              label="Fee collection"
              color="#059669"
            />
            <div className="w-full space-y-3 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-500">👦 Boys</span>
                <span className="font-semibold text-slate-800">
                  {maleCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-500">👧 Girls</span>
                <span className="font-semibold text-slate-800">
                  {femaleCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-500">💰 Pending dues</span>
                <span className="font-semibold text-rose-600">
                  {formatINR(pending)}
                </span>
              </div>
            </div>
          </div>
        </WidgetCard>
      </div>

      {/* Enrollment bar chart */}
      <div className="mt-4">
        <WidgetCard title="Enrollment" subtitle="Students per class">
          <ClassBars data={classBars} />
        </WidgetCard>
      </div>
    </>
  );
}

// ── TEACHER ────────────────────────────────────────────────────
async function TeacherDashboard({
  schoolId,
  id,
  name,
}: {
  schoolId: string;
  id: string;
  name: string;
}) {
  const classes = await prisma.schoolClass.findMany({
    where: { schoolId, classTeacherId: id },
    include: { _count: { select: { students: true } } },
  });
  const totalStudents = classes.reduce((s, c) => s + c._count.students, 0);
  const trend = await buildAttendanceTrend(schoolId);

  return (
    <>
      <Header name={name} subtitle="Your classes" />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <QuickAction
          href="/dashboard/attendance"
          icon={<CalendarCheck />}
          label="Mark Attendance"
        />
        <QuickAction
          href="/dashboard/students"
          icon={<Users />}
          label="View Students"
        />
        <QuickAction href="/dashboard" icon={<TrendingUp />} label="Overview" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatWidget
          icon={<School />}
          label="My Classes"
          value={String(classes.length)}
        />
        <StatWidget
          icon={<Users />}
          label="My Students"
          value={String(totalStudents)}
        />
        <StatWidget
          icon={<CalendarDays />}
          label="Today"
          value={formatDate(new Date())}
        />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WidgetCard
            title="Attendance"
            subtitle="Present students, last 7 days"
          >
            <AttendanceTrend data={trend} />
          </WidgetCard>
        </div>
        <WidgetCard title="My classes">
          <div className="space-y-3">
            {classes.length === 0 ? (
              <p className="text-sm text-slate-400">No classes assigned yet.</p>
            ) : (
              classes.map((c) => (
                <ActivityItem
                  key={c.id}
                  icon={<GraduationCap />}
                  tone="indigo"
                  title={`${c.name} · ${c.section}`}
                  meta={`${c._count.students} students`}
                />
              ))
            )}
          </div>
        </WidgetCard>
      </div>
    </>
  );
}

// ── PARENT / STUDENT ──────────────────────────────────────────
async function FamilyDashboard({
  schoolId,
  id,
  role,
  name,
}: {
  schoolId: string;
  id: string;
  role: string;
  name: string;
}) {
  const children = await prisma.student.findMany({
    where:
      role === "PARENT" ? { schoolId, parentId: id } : { schoolId, userId: id },
    include: {
      schoolClass: true,
      attendance: { orderBy: { date: "desc" }, take: 30 },
      payments: true,
    },
  });

  return (
    <>
      <Header name={name} subtitle="Family overview" />
      <div className="grid grid-cols-1 gap-4">
        {children.length === 0 ? (
          <WidgetCard title="No student linked">
            <p className="text-sm text-slate-500">
              No student is linked to your account yet. Please contact the
              school office.
            </p>
          </WidgetCard>
        ) : (
          children.map((s) => {
            const total = s.attendance.length;
            const present = s.attendance.filter(
              (a) => a.status === "PRESENT" || a.status === "LATE",
            ).length;
            const pct = total ? Math.round((present / total) * 100) : 0;
            const paid = s.payments.reduce(
              (sum, p) => sum + Number(p.amount),
              0,
            );
            return (
              <WidgetCard
                key={s.id}
                title={`${s.firstName} ${s.lastName}`}
                subtitle={
                  s.schoolClass
                    ? `${s.schoolClass.name} · ${s.schoolClass.section}`
                    : "Unassigned"
                }
              >
                <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-3">
                  <ProgressRing pct={pct} label="Attendance" />
                  <div className="space-y-2 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Days present</span>
                      <span className="font-semibold text-slate-800">
                        {present}/{total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Admission No.</span>
                      <span className="font-semibold text-slate-800">
                        {s.admissionNo}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fees paid</span>
                      <span className="font-semibold text-emerald-600">
                        {formatINR(paid)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <ProgressRow
                      label="Attendance"
                      pct={pct}
                      tone={pct >= 75 ? "emerald" : "amber"}
                    />
                  </div>
                </div>
              </WidgetCard>
            );
          })
        )}
      </div>
    </>
  );
}

function Header({ name, subtitle }: { name: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">
        Welcome back, {name.split(" ")[0]}
      </h1>
      <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

async function buildAttendanceTrend(schoolId: string) {
  // ONE query for the whole 7-day window (was 7 sequential queries = slow).
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);

  const rows = await prisma.attendance.findMany({
    where: { schoolId, status: "PRESENT", date: { gte: start } },
    select: { date: true },
  });

  const buckets = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    buckets.set(d.toDateString(), 0);
  }
  for (const r of rows) {
    const key = new Date(r.date).toDateString();
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  const days: { day: string; present: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push({
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
      present: buckets.get(d.toDateString()) ?? 0,
    });
  }
  return days;
}
