// Students list page. Admins + teachers can view.
import { requireSchool } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { PageTitle, Table, Badge, LinkButton } from "@/components/ui";
import { formatDate } from "@/lib/format";

export default async function StudentsPage() {
  const { user, schoolId } = await requireSchool(["ADMIN", "TEACHER"]);

  // Everyone is scoped to their own school. Teachers additionally only see
  // students in the classes they teach.
  const where =
    user.role === "TEACHER"
      ? { schoolId, schoolClass: { classTeacherId: user.id }, isActive: true }
      : { schoolId, isActive: true };

  const students = await prisma.student.findMany({
    where,
    include: { schoolClass: true },
    orderBy: { admissionNo: "asc" },
  });

  const rows = students.map((s) => [
    s.admissionNo,
    `${s.firstName} ${s.lastName}`,
    s.schoolClass ? (
      `${s.schoolClass.name} - ${s.schoolClass.section}`
    ) : (
      <Badge color="amber">Unassigned</Badge>
    ),
    s.gender,
    s.guardianName,
    s.guardianPhone,
    formatDate(s.admissionDate),
  ]);

  return (
    <>
      <div className="flex items-center justify-between">
        <PageTitle title="Students" subtitle={`${students.length} active`} />
        {user.role === "ADMIN" && (
          <LinkButton href="/dashboard/students/new">+ Add Student</LinkButton>
        )}
      </div>
      <Table
        headers={[
          "Adm. No",
          "Name",
          "Class",
          "Gender",
          "Guardian",
          "Phone",
          "Admitted",
        ]}
        rows={rows}
      />
    </>
  );
}
