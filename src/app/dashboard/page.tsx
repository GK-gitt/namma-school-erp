// Dashboard home — shows different stats depending on role.
import { requireUser } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { PageTitle, StatCard, Card } from "@/components/ui";
import { formatINR, startOfToday } from "@/lib/format";

export default async function DashboardPage() {
  const user = await requireUser();

  // ADMIN: whole-school numbers.
  if (user.role === "ADMIN") {
    const [students, classes, todayPresent, totalCollected] = await Promise.all(
      [
        prisma.student.count({ where: { isActive: true } }),
        prisma.schoolClass.count(),
        prisma.attendance.count({
          where: {
            status: "PRESENT",
            date: { gte: startOfToday() },
          },
        }),
        prisma.feePayment.aggregate({ _sum: { amount: true } }),
      ],
    );

    return (
      <>
        <PageTitle title={`Welcome, ${user.name}`} subtitle="School overview" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active Students" value={String(students)} />
          <StatCard label="Classes" value={String(classes)} />
          <StatCard label="Present Today" value={String(todayPresent)} />
          <StatCard
            label="Fees Collected"
            value={formatINR(Number(totalCollected._sum.amount ?? 0))}
          />
        </div>
      </>
    );
  }

  // TEACHER: their classes.
  if (user.role === "TEACHER") {
    const classes = await prisma.schoolClass.findMany({
      where: { classTeacherId: user.id },
      include: { _count: { select: { students: true } } },
    });
    return (
      <>
        <PageTitle title={`Welcome, ${user.name}`} subtitle="Your classes" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.length === 0 ? (
            <Card>You are not assigned as class teacher to any class yet.</Card>
          ) : (
            classes.map((c) => (
              <StatCard
                key={c.id}
                label={`${c.name} - ${c.section}`}
                value={`${c._count.students} students`}
                hint={c.academicYear}
              />
            ))
          )}
        </div>
      </>
    );
  }

  // PARENT / STUDENT: quick peek at their child/self.
  const children = await prisma.student.findMany({
    where: user.role === "PARENT" ? { parentId: user.id } : { userId: user.id },
    include: { schoolClass: true },
  });

  return (
    <>
      <PageTitle title={`Welcome, ${user.name}`} subtitle="Overview" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {children.length === 0 ? (
          <Card>
            No student linked to your account yet. Please contact the school
            office.
          </Card>
        ) : (
          children.map((s) => (
            <StatCard
              key={s.id}
              label={`${s.firstName} ${s.lastName}`}
              value={
                s.schoolClass
                  ? `${s.schoolClass.name} - ${s.schoolClass.section}`
                  : "Unassigned"
              }
              hint={`Admission No: ${s.admissionNo}`}
            />
          ))
        )}
      </div>
    </>
  );
}
