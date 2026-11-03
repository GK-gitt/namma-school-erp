// Dashboard home — rich, colorful, role-aware with charts & widgets.
import { requireSchool } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { formatINR, startOfToday, formatDate } from "@/lib/format";
import { StatWidget, WidgetCard } from "@/components/widgets";
import { AttendanceTrend, FeeDonut, ClassBars } from "@/components/charts";
import {
  Users,
  School,
  CheckCircle2,
  Wallet,
  CalendarDays,
  GraduationCap,
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
    todayPresent,
    totalCollected,
    allStructures,
    allPayments,
    classList,
  ] = await Promise.all([
    prisma.student.count({ where: { schoolId, isActive: true } }),
    prisma.schoolClass.count({ where: { schoolId } }),
    prisma.attendance.count({
      where: { schoolId, status: "PRESENT", date: { gte: startOfToday() } },
    }),
    prisma.feePayment.aggregate({
      where: { schoolId },
      _sum: { amount: true },
    }),
    prisma.feeStructure.aggregate({
      where: { schoolId },
      _sum: { amount: true },
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

  // Attendance trend for the last 7 days.
  const trend = await buildAttendanceTrend(schoolId);

  const paid = Number(allPayments._sum.amount ?? 0);
  // Expected = sum of (each class's fee structures total × students in class).
  const expectedTotal = await computeExpectedTotal(schoolId);
  const pending = Math.max(expectedTotal - paid, 0);

  const classBars = classList.map((c) => ({
    name: `${c.name.replace("Class ", "")}-${c.section}`,
    students: c._count.students,
  }));

  return (
    <>
      <Header name={name} subtitle="Here's your school today" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatWidget
          icon={<Users />}
          label="Active Students"
          value={String(students)}
          tone="kesari"
        />
        <StatWidget
          icon={<School />}
          label="Classes"
          value={String(classes)}
          tone="haldi"
        />
        <StatWidget
          icon={<CheckCircle2 />}
          label="Present Today"
          value={String(todayPresent)}
          tone="malnad"
        />
        <StatWidget
          icon={<Wallet />}
          label="Fees Collected"
          value={formatINR(Number(totalCollected._sum.amount ?? 0))}
          tone="blue"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WidgetCard title="📈 Attendance — last 7 days">
            <AttendanceTrend data={trend} />
          </WidgetCard>
        </div>
        <WidgetCard title="💰 Fee Collection">
          <FeeDonut paid={paid} pending={pending} />
        </WidgetCard>
      </div>

      <div className="mt-6">
        <WidgetCard title="🏫 Students per class">
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
      <Header name={name} subtitle="Your classes at a glance" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatWidget
          icon={<School />}
          label="My Classes"
          value={String(classes.length)}
          tone="kesari"
        />
        <StatWidget
          icon={<Users />}
          label="My Students"
          value={String(totalStudents)}
          tone="haldi"
        />
        <StatWidget
          icon={<CalendarDays />}
          label="Today"
          value={formatDate(new Date())}
          tone="malnad"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.length === 0 ? (
          <WidgetCard title="No classes yet">
            <p className="text-sm text-slate-500">
              You are not assigned as class teacher to any class yet.
            </p>
          </WidgetCard>
        ) : (
          classes.map((c) => (
            <StatWidget
              key={c.id}
              icon={<GraduationCap />}
              label={`${c.name} - ${c.section}`}
              value={`${c._count.students} students`}
              tone="blue"
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
      <Header name={name} subtitle="Your family overview" />
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
                  ? `${s.schoolClass.name} - ${s.schoolClass.section}`
                  : "Unassigned"
              }
              tone="kesari"
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
      <h1 className="text-2xl font-extrabold text-slate-900">
        Welcome back, {name.split(" ")[0]}! 👋
      </h1>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
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
