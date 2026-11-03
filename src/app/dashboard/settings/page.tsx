// School Settings / profile page — Admin only, scoped to their own school.
import { requireSchool } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./form";

export default async function SettingsPage() {
  const { schoolId } = await requireSchool(["ADMIN"]);

  const school = await prisma.school.findUnique({ where: { id: schoolId } });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">
          School Settings 🏫
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Your school's profile and branding
        </p>
      </div>
      <SettingsForm
        initial={{
          name: school?.name ?? "",
          tagline: school?.tagline ?? "",
          affiliation: school?.affiliation ?? "CBSE",
          academicYear: school?.academicYear ?? "2025-2026",
          address: school?.address ?? "",
          city: school?.city ?? "Bengaluru",
          state: school?.state ?? "Karnataka",
          phone: school?.phone ?? "",
          email: school?.email ?? "",
          website: school?.website ?? "",
          principalName: school?.principalName ?? "",
          upiId: school?.upiId ?? "",
        }}
      />
    </>
  );
}
