"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { attendanceSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function saveAttendance(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const user = await requireRole(["ADMIN", "TEACHER"]);

  const classId = String(formData.get("classId"));
  const date = String(formData.get("date"));

  // Form sends status for each student as "status_<studentId>".
  const records: { studentId: string; status: string }[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("status_")) {
      records.push({
        studentId: key.replace("status_", ""),
        status: String(value),
      });
    }
  }

  const parsed = attendanceSchema.safeParse({ classId, date, records });
  if (!parsed.success) {
    return { error: "Invalid attendance data." };
  }

  // A teacher may only mark attendance for a class they teach.
  if (user.role === "TEACHER") {
    const cls = await prisma.schoolClass.findUnique({ where: { id: classId } });
    if (!cls || cls.classTeacherId !== user.id) {
      return { error: "You can only mark attendance for your own class." };
    }
  }

  const theDate = new Date(date);
  theDate.setHours(0, 0, 0, 0);

  // Upsert each record (one per student per day — enforced by DB unique index).
  await prisma.$transaction(
    parsed.data.records.map((r) =>
      prisma.attendance.upsert({
        where: { studentId_date: { studentId: r.studentId, date: theDate } },
        create: {
          studentId: r.studentId,
          date: theDate,
          status: r.status as "PRESENT" | "ABSENT" | "LATE" | "LEAVE",
          classId,
          markedById: user.id,
        },
        update: {
          status: r.status as "PRESENT" | "ABSENT" | "LATE" | "LEAVE",
          markedById: user.id,
        },
      }),
    ),
  );

  revalidatePath("/dashboard/attendance");
  return { ok: true };
}
