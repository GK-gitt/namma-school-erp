"use server";

// Server actions for the Students module. Tenant-scoped: every action is
// bound to the current user's school.
import { prisma } from "@/lib/prisma";
import { requireSchool } from "@/lib/rbac";
import { studentSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function createStudent(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  // Only admins may add students — and only within their own school.
  const { schoolId } = await requireSchool(["ADMIN"]);

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

  // Admission numbers are unique WITHIN a school.
  const existing = await prisma.student.findFirst({
    where: { schoolId, admissionNo: data.admissionNo },
  });
  if (existing) {
    return { error: `Admission number ${data.admissionNo} already exists.` };
  }

  // If a class was chosen, make sure it belongs to THIS school (no cross-tenant).
  if (data.classId) {
    const cls = await prisma.schoolClass.findFirst({
      where: { id: data.classId, schoolId },
    });
    if (!cls) return { error: "Invalid class selected." };
  }

  await prisma.student.create({
    data: {
      schoolId,
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
