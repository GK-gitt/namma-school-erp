// Dashboard — premium B2B SaaS aesthetic (Linear/Vercel/Stripe style).
import { requireSchool } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { formatINR, startOfToday, formatDate } from "@/lib/format";
import { StatWidget, WidgetCard } from "@/components/widgets";
import { AttendanceTrend, FeeDonut, ClassBars } from "@/components/charts";
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Percent,
  School,
  CalendarDays,
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
      include: { _count: { select: { students: true } } },
    }),
  ]);

  const trend = await buildAttendanceTrend(schoolId);
  const paid = Number(totalPaid._sum.amount ?? 0);
  const expectedTotal = await computeExpectedTotal(schoolId);
  const pending = Math.max(expectedTotal - paid, 0);
  const collectionRate =
    expectedTotal > 0 ? Math.round((paid / expectedTotal) * 100) : 0;
  const attendanceRate =
    activeStudents > 0 ? Math.round((todayPresent / activeStudents) * 100) : 0;

  const classBars = classList.map((c) => ({
    name: `${c.name.replace("Class ", "")}-${c.section}`,
    students: c._count.students,
  }));

  return (
    <>
      <Header name={name} subtitle="School overview" />

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

  return (
    <>
      <Header name={name} subtitle="Your classes" />
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
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.length === 0 ? (
          <WidgetCard title="No classes assigned">
            <p className="text-sm text-slate-500">
              You are not a class teacher for any class yet.
            </p>
          </WidgetCard>
        ) : (
          classes.map((c) => (
            <StatWidget
              key={c.id}
              icon={<GraduationCap />}
              label={`${c.name} · ${c.section}`}
              value={`${c._count.students}`}
              sub="students"
            />
          ))
        )}
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
    include: { schoolClass: true },
  });

  return (
    <>
      <Header name={name} subtitle="Family overview" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {children.length === 0 ? (
          <WidgetCard title="No student linked">
            <p className="text-sm text-slate-500">
              No student is linked to your account yet. Please contact the
              school office.
            </p>
          </WidgetCard>
        ) : (
          children.map((s) => (
            <StatWidget
              key={s.id}
              icon={<GraduationCap />}
              label={`${s.firstName} ${s.lastName}`}
              value={
                s.schoolClass
                  ? `${s.schoolClass.name} · ${s.schoolClass.section}`
                  : "Unassigned"
              }
              sub={`Adm. ${s.admissionNo}`}
            />
          ))
        )}
      </div>
    </>
  );
}

// ── shared header ──────────────────────────────────────────────
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

// ── helpers ────────────────────────────────────────────────────
async function buildAttendanceTrend(schoolId: string) {
  const days: { day: string; present: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const present = await prisma.attendance.count({
      where: { schoolId, status: "PRESENT", date: { gte: d, lt: next } },
    });
    days.push({
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
      present,
    });
  }
  return days;
}

async function computeExpectedTotal(schoolId: string) {
  const classes = await prisma.schoolClass.findMany({
    where: { schoolId },
    include: {
      feeStructure: true,
      _count: { select: { students: true } },
    },
  });
  let total = 0;
  for (const c of classes) {
    const perStudent = c.feeStructure.reduce((s, f) => s + Number(f.amount), 0);
    total += perStudent * c._count.students;
  }
  return total;
}
