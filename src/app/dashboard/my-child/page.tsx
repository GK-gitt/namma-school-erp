// Parent / Student read-only view. RBAC guarantees they see ONLY their own.
import { requireSchool } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { PageTitle, Card, StatCard, Table, Badge } from "@/components/ui";
import { formatINR, formatDate } from "@/lib/format";

export default async function MyChildPage() {
  const { user, schoolId } = await requireSchool(["PARENT", "STUDENT"]);

  // Critical security line: only fetch students linked to THIS user.
  // Also scope by schoolId for defense in depth.
  const students = await prisma.student.findMany({
    where:
      user.role === "PARENT"
        ? { schoolId, parentId: user.id }
        : { schoolId, userId: user.id },
    include: {
      schoolClass: { include: { feeStructure: true } },
      attendance: { orderBy: { date: "desc" }, take: 30 },
      payments: { orderBy: { paidOn: "desc" } },
    },
  });

  if (students.length === 0) {
    return (
      <>
        <PageTitle title="My Child" />
        <Card>
          No student is linked to your account yet. Please contact the school
          office.
        </Card>
      </>
    );
  }

  return (
    <>
      <PageTitle title="My Child" subtitle="Attendance and fees" />
      <div className="space-y-8">
        {students.map((s) => {
          const total = s.attendance.length;
          const present = s.attendance.filter(
            (a) => a.status === "PRESENT" || a.status === "LATE",
          ).length;
          const pct = total ? Math.round((present / total) * 100) : 0;

          const expected = s.schoolClass
            ? s.schoolClass.feeStructure.reduce(
                (sum, f) => sum + Number(f.amount),
                0,
              )
            : 0;
          const paid = s.payments.reduce((sum, p) => sum + Number(p.amount), 0);
          const pending = Math.max(expected - paid, 0);

          return (
            <div key={s.id}>
              <h2 className="mb-3 text-lg font-bold text-slate-900">
                {s.firstName} {s.lastName}{" "}
                <span className="text-sm font-normal text-slate-500">
                  (
                  {s.schoolClass
                    ? `${s.schoolClass.name}-${s.schoolClass.section}`
                    : "Unassigned"}
                  )
                </span>
              </h2>

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
                <StatCard
                  label="Attendance"
                  value={`${pct}%`}
                  hint={`${present}/${total} days`}
                />
                <StatCard label="Fees Expected" value={formatINR(expected)} />
                <StatCard label="Fees Paid" value={formatINR(paid)} />
                <StatCard label="Pending" value={formatINR(pending)} />
              </div>

              <h3 className="mb-2 text-sm font-semibold text-slate-700">
                Recent attendance
              </h3>
              <div className="mb-4">
                <Table
                  headers={["Date", "Status"]}
                  rows={s.attendance
                    .slice(0, 10)
                    .map((a) => [
                      formatDate(a.date),
                      <Badge
                        color={
                          a.status === "PRESENT"
                            ? "green"
                            : a.status === "ABSENT"
                              ? "red"
                              : a.status === "LATE"
                                ? "amber"
                                : "blue"
                        }
                      >
                        {a.status}
                      </Badge>,
                    ])}
                />
              </div>

              <h3 className="mb-2 text-sm font-semibold text-slate-700">
                Payment history
              </h3>
              <Table
                headers={["Receipt", "Amount", "Mode", "Date"]}
                rows={s.payments.map((p) => [
                  p.receiptNo,
                  formatINR(Number(p.amount)),
                  p.mode,
                  formatDate(p.paidOn),
                ])}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
