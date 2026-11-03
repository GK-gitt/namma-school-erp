// Classes module — list + inline add form. Admin only.
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { PageTitle, Table, Badge } from "@/components/ui";
import { ClassForm } from "./form";

export default async function ClassesPage() {
  await requireRole(["ADMIN"]);

  const [classes, teachers] = await Promise.all([
    prisma.schoolClass.findMany({
      include: {
        classTeacher: true,
        _count: { select: { students: true } },
      },
      orderBy: [{ academicYear: "desc" }, { name: "asc" }, { section: "asc" }],
    }),
    prisma.user.findMany({ where: { role: "TEACHER", isActive: true } }),
  ]);

  const rows = classes.map((c) => [
    `${c.name} - ${c.section}`,
    c.academicYear,
    c._count.students,
    c.classTeacher ? (
      c.classTeacher.name
    ) : (
      <Badge color="amber">No teacher</Badge>
    ),
  ]);

  return (
    <>
      <PageTitle title="Classes" subtitle={`${classes.length} total`} />
      <div className="mb-6">
        <ClassForm
          teachers={teachers.map((t) => ({ id: t.id, name: t.name }))}
        />
      </div>
      <Table
        headers={["Class", "Academic Year", "Students", "Class Teacher"]}
        rows={rows}
      />
    </>
  );
}
