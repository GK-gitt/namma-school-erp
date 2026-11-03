"use server";

import { prisma } from "@/lib/prisma";
import { requireSchool } from "@/lib/rbac";
import { attendanceSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function saveAttendance(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const { user, schoolId } = await requireSchool(["ADMIN", "TEACHER"]);

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

  // The class must belong to THIS school (no cross-tenant marking).
  const cls = await prisma.schoolClass.findFirst({
    where: { id: classId, schoolId },
  });
  if (!cls) {
    return { error: "Invalid class selected." };
  }

  // A teacher may only mark attendance for a class they teach.
  if (user.role === "TEACHER" && cls.classTeacherId !== user.id) {
    return { error: "You can only mark attendance for your own class." };
  }

  const theDate = new Date(date);
  theDate.setHours(0, 0, 0, 0);

  // SECURITY: never trust studentIds from the form. Only accept students who
  // actually belong to THIS class in THIS school. This prevents a crafted
  // request from touching another school's (or class's) student records.
  const validStudents = await prisma.student.findMany({
    where: { schoolId, classId },
    select: { id: true },
  });
  const validIds = new Set(validStudents.map((s) => s.id));
  const safeRecords = parsed.data.records.filter((r) =>
    validIds.has(r.studentId),
  );

  // Upsert each record (one per student per day — enforced by DB unique index).
  await prisma.$transaction(
    safeRecords.map((r) =>
      prisma.attendance.upsert({
        where: { studentId_date: { studentId: r.studentId, date: theDate } },
        create: {
          schoolId,
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
