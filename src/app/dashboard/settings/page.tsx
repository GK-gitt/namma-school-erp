// School Settings / profile page — Admin only.
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./form";

export default async function SettingsPage() {
  await requireRole(["ADMIN"]);

  const settings = await prisma.schoolSettings.findUnique({
    where: { id: "default" },
  });

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
          name: settings?.name ?? "Namma School",
          tagline: settings?.tagline ?? "Namma Shaale, Namma Future",
          affiliation: settings?.affiliation ?? "CBSE",
          academicYear: settings?.academicYear ?? "2025-2026",
          address: settings?.address ?? "",
          city: settings?.city ?? "Bengaluru",
          state: settings?.state ?? "Karnataka",
          phone: settings?.phone ?? "",
          email: settings?.email ?? "",
          website: settings?.website ?? "",
          principalName: settings?.principalName ?? "",
        }}
      />
    </>
  );
}
