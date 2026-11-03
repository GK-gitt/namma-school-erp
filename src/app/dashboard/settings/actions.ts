"use server";

import { prisma } from "@/lib/prisma";
import { requireSchool } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function saveSettings(
  _prev: { ok?: boolean; error?: string } | undefined,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  // Admins edit ONLY their own school's profile.
  const { schoolId } = await requireSchool(["ADMIN"]);

  const get = (k: string) => {
    const v = formData.get(k);
    return v ? String(v) : null;
  };

  const name = get("name");
  if (!name) return { error: "School name is required." };

  await prisma.school.update({
    where: { id: schoolId },
    data: {
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
      upiId: get("upiId"),
    },
  });

  revalidatePath("/dashboard/settings");
  return { ok: true };
}
