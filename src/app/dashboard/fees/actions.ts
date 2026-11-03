"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { feeStructureSchema, feePaymentSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function createFeeStructure(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireRole(["ADMIN"]);

  const parsed = feeStructureSchema.safeParse({
    title: formData.get("title"),
    amount: formData.get("amount"),
    dueDate: formData.get("dueDate"),
    academicYear: formData.get("academicYear"),
    classId: formData.get("classId"),
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const d = parsed.data;
  await prisma.feeStructure.create({
    data: {
      title: d.title,
      amount: d.amount,
      dueDate: new Date(d.dueDate),
      academicYear: d.academicYear,
      classId: d.classId,
    },
  });

  revalidatePath("/dashboard/fees");
  return { ok: true };
}

export async function recordPayment(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireRole(["ADMIN"]);

  const parsed = feePaymentSchema.safeParse({
    studentId: formData.get("studentId"),
    amount: formData.get("amount"),
    mode: formData.get("mode"),
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const d = parsed.data;

  // Generate a simple unique receipt number.
  const receiptNo = `RCPT-${Date.now()}`;

  await prisma.feePayment.create({
    data: {
      studentId: d.studentId,
      amount: d.amount,
      mode: d.mode,
      note: d.note,
      receiptNo,
    },
  });

  revalidatePath("/dashboard/fees");
  return { ok: true };
}
