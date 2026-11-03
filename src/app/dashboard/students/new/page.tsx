// Add-student form page. Admin only.
import { requireSchool } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/ui";
import { StudentForm } from "./form";

export default async function NewStudentPage() {
  const { schoolId } = await requireSchool(["ADMIN"]);

  const classes = await prisma.schoolClass.findMany({
    where: { schoolId },
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
