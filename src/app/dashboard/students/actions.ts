"use server";

// Server actions for the Students module. Every action re-checks the role.
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { studentSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function createStudent(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  // Only admins may add students.
  await requireRole(["ADMIN"]);

  const parsed = studentSchema.safeParse({
    admissionNo: formData.get("admissionNo"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    bloodGroup: formData.get("bloodGroup") || undefined,
    guardianName: formData.get("guardianName"),
    guardianPhone: formData.get("guardianPhone"),
    address: formData.get("address") || undefined,
    classId: formData.get("classId") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;

  // Guard against duplicate admission numbers.
  const existing = await prisma.student.findUnique({
    where: { admissionNo: data.admissionNo },
  });
  if (existing) {
    return { error: `Admission number ${data.admissionNo} already exists.` };
  }

  await prisma.student.create({
    data: {
      admissionNo: data.admissionNo,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: new Date(data.dateOfBirth),
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      address: data.address,
      classId: data.classId || null,
    },
  });

  revalidatePath("/dashboard/students");
  return { ok: true };
}
