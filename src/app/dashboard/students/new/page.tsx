// Add-student form page. Admin only.
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/ui";
import { StudentForm } from "./form";

export default async function NewStudentPage() {
  await requireRole(["ADMIN"]);

  const classes = await prisma.schoolClass.findMany({
    orderBy: [{ name: "asc" }, { section: "asc" }],
  });

  return (
    <>
      <PageTitle title="Add Student" subtitle="Create a new student record" />
      <StudentForm
        classes={classes.map((c) => ({
          id: c.id,
          label: `${c.name} - ${c.section} (${c.academicYear})`,
        }))}
      />
    </>
  );
}
