// Attendance module. Teacher picks class + date (via URL params),
// sees the roster with any existing marks, and saves.
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { PageTitle, Card } from "@/components/ui";
import { AttendanceSheet } from "./sheet";
import { startOfToday } from "@/lib/format";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; date?: string }>;
}) {
  const user = await requireRole(["ADMIN", "TEACHER"]);
  const params = await searchParams;

  // Which classes can this user mark?
  const classes = await prisma.schoolClass.findMany({
    where: user.role === "TEACHER" ? { classTeacherId: user.id } : {},
    orderBy: [{ name: "asc" }, { section: "asc" }],
  });

  const selectedClassId = params.classId || classes[0]?.id;
  const selectedDate = params.date || toISODate(startOfToday());

  let students: { id: string; name: string; status: string }[] = [];
  if (selectedClassId) {
    const theDate = new Date(selectedDate);
    theDate.setHours(0, 0, 0, 0);

    const roster = await prisma.student.findMany({
      where: { classId: selectedClassId, isActive: true },
      orderBy: { admissionNo: "asc" },
      include: {
        attendance: { where: { date: theDate } },
      },
    });

    students = roster.map((s) => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      status: s.attendance[0]?.status ?? "PRESENT",
    }));
  }

  return (
    <>
      <PageTitle title="Attendance" subtitle="Mark daily attendance" />
      {classes.length === 0 ? (
        <Card>No classes assigned to you yet.</Card>
      ) : (
        <AttendanceSheet
          classes={classes.map((c) => ({
            id: c.id,
            label: `${c.name} - ${c.section}`,
          }))}
          selectedClassId={selectedClassId!}
          selectedDate={selectedDate}
          students={students}
        />
      )}
    </>
  );
}

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}
