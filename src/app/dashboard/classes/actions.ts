"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { classSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function createClass(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireRole(["ADMIN"]);

  const parsed = classSchema.safeParse({
    name: formData.get("name"),
    section: formData.get("section"),
    academicYear: formData.get("academicYear"),
    classTeacherId: formData.get("classTeacherId") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;

  const existing = await prisma.schoolClass.findFirst({
    where: {
      name: data.name,
      section: data.section,
      academicYear: data.academicYear,
    },
  });
  if (existing) {
    return { error: "That class + section already exists for this year." };
  }

  await prisma.schoolClass.create({
    data: {
      name: data.name,
      section: data.section,
      academicYear: data.academicYear,
      classTeacherId: data.classTeacherId || null,
    },
  });

  revalidatePath("/dashboard/classes");
  return { ok: true };
}
