// Fees module. Admin defines fee structures and records payments.
// Shows each student's expected fee vs. paid vs. pending.
import { requireSchool } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { PageTitle, Card, Table, Badge } from "@/components/ui";
import { formatINR } from "@/lib/format";
import { FeeStructureForm, PaymentForm } from "./forms";

export default async function FeesPage() {
  const { schoolId } = await requireSchool(["ADMIN"]);

  const [classes, structures, students, payments] = await Promise.all([
    prisma.schoolClass.findMany({
      where: { schoolId },
      orderBy: [{ name: "asc" }, { section: "asc" }],
    }),
    prisma.feeStructure.findMany({
      where: { schoolId },
      include: { schoolClass: true },
    }),
    prisma.student.findMany({
      where: { schoolId, isActive: true },
      include: { schoolClass: true, payments: true },
      orderBy: { admissionNo: "asc" },
    }),
    prisma.feePayment.findMany({
      where: { schoolId },
      include: { student: true },
      orderBy: { paidOn: "desc" },
      take: 10,
    }),
  ]);

  // Expected fee per class = sum of its fee structures.
  const expectedByClass = new Map<string, number>();
  for (const s of structures) {
    expectedByClass.set(
      s.classId,
      (expectedByClass.get(s.classId) ?? 0) + Number(s.amount),
    );
  }

  const studentRows = students.map((s) => {
    const expected = s.classId ? (expectedByClass.get(s.classId) ?? 0) : 0;
    const paid = s.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const pending = Math.max(expected - paid, 0);
    return [
      s.admissionNo,
      `${s.firstName} ${s.lastName}`,
      s.schoolClass ? `${s.schoolClass.name}-${s.schoolClass.section}` : "—",
      formatINR(expected),
      formatINR(paid),
      pending > 0 ? (
        <Badge color="red">{formatINR(pending)}</Badge>
      ) : (
        <Badge color="green">Clear</Badge>
      ),
    ];
  });

  const paymentRows = payments.map((p) => [
    p.receiptNo,
    `${p.student.firstName} ${p.student.lastName}`,
    formatINR(Number(p.amount)),
    p.mode,
    new Date(p.paidOn).toLocaleDateString("en-IN"),
  ]);

  return (
    <>
      <PageTitle title="Fees" subtitle="Fee structures, payments, and dues" />

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Add fee structure
          </h3>
          <FeeStructureForm
            classes={classes.map((c) => ({
              id: c.id,
              label: `${c.name}-${c.section}`,
            }))}
          />
        </Card>
        <Card>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Record a payment
          </h3>
          <PaymentForm
            students={students.map((s) => ({
              id: s.id,
              label: `${s.admissionNo} — ${s.firstName} ${s.lastName}`,
            }))}
          />
        </Card>
      </div>

      <h3 className="mb-2 text-sm font-semibold text-slate-700">
        Student dues
      </h3>
      <div className="mb-6">
        <Table
          headers={["Adm. No", "Name", "Class", "Expected", "Paid", "Pending"]}
          rows={studentRows}
        />
      </div>

      <h3 className="mb-2 text-sm font-semibold text-slate-700">
        Recent payments
      </h3>
      <Table
        headers={["Receipt", "Student", "Amount", "Mode", "Date"]}
        rows={paymentRows}
      />
    </>
  );
}
