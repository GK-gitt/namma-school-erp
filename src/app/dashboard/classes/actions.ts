"use server";

import { prisma } from "@/lib/prisma";
import { requireSchool } from "@/lib/rbac";
import { classSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function createClass(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const { schoolId } = await requireSchool(["ADMIN"]);

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

  // Class + section + year is unique WITHIN a school.
  const existing = await prisma.schoolClass.findFirst({
    where: {
      schoolId,
      name: data.name,
      section: data.section,
      academicYear: data.academicYear,
    },
  });
  if (existing) {
    return { error: "That class + section already exists for this year." };
  }

  // If a class teacher was chosen, verify they're a TEACHER in THIS school.
  if (data.classTeacherId) {
    const teacher = await prisma.user.findFirst({
      where: { id: data.classTeacherId, schoolId, role: "TEACHER" },
    });
    if (!teacher) return { error: "Invalid class teacher selected." };
  }

  await prisma.schoolClass.create({
    data: {
      schoolId,
      name: data.name,
      section: data.section,
      academicYear: data.academicYear,
      classTeacherId: data.classTeacherId || null,
    },
  });

  revalidatePath("/dashboard/classes");
  return { ok: true };
}
