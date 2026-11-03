"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function saveSettings(
  _prev: { ok?: boolean; error?: string } | undefined,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  await requireRole(["ADMIN"]);

  const get = (k: string) => {
    const v = formData.get(k);
    return v ? String(v) : null;
  };

  const name = get("name");
  if (!name) return { error: "School name is required." };

  await prisma.schoolSettings.upsert({
    where: { id: "default" },
    update: {
      name,
      tagline: get("tagline"),
      affiliation: get("affiliation"),
      academicYear: get("academicYear") ?? "2025-2026",
      address: get("address"),
      city: get("city"),
      state: get("state"),
      phone: get("phone"),
      email: get("email"),
      website: get("website"),
      principalName: get("principalName"),
    },
    create: {
      id: "default",
      name,
      tagline: get("tagline"),
      affiliation: get("affiliation"),
      academicYear: get("academicYear") ?? "2025-2026",
      address: get("address"),
      city: get("city"),
      state: get("state"),
      phone: get("phone"),
      email: get("email"),
      website: get("website"),
      principalName: get("principalName"),
    },
  });

  revalidatePath("/dashboard/settings");
  return { ok: true };
}
