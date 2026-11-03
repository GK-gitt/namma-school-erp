"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { saveAttendance } from "./actions";
import { Card } from "@/components/ui";

const STATUSES = ["PRESENT", "ABSENT", "LATE", "LEAVE"] as const;
type Status = (typeof STATUSES)[number];

const STATUS_STYLE: Record<Status, string> = {
  PRESENT: "bg-green-100 text-green-700 ring-green-300",
  ABSENT: "bg-red-100 text-red-700 ring-red-300",
  LATE: "bg-amber-100 text-amber-700 ring-amber-300",
  LEAVE: "bg-blue-100 text-blue-700 ring-blue-300",
};

export function AttendanceSheet({
  classes,
  selectedClassId,
  selectedDate,
  students,
}: {
  classes: { id: string; label: string }[];
  selectedClassId: string;
  selectedDate: string;
  students: { id: string; name: string; status: string }[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(saveAttendance, {});

  // Local state so clicking a status button updates the UI instantly.
  const [marks, setMarks] = useState<Record<string, Status>>(
    Object.fromEntries(
      students.map((s) => [s.id, (s.status as Status) ?? "PRESENT"]),
    ),
  );

  // Changing class/date reloads the page with new URL params.
  function navigate(classId: string, date: string) {
    router.push(`/dashboard/attendance?classId=${classId}&date=${date}`);
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Class
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => navigate(e.target.value, selectedDate)}
              className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => navigate(selectedClassId, e.target.value)}
              className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Sheet */}
      <form action={formAction}>
        <input type="hidden" name="classId" value={selectedClassId} />
        <input type="hidden" name="date" value={selectedDate} />

        <Card>
          {students.length === 0 ? (
            <p className="text-slate-400">No students in this class.</p>
          ) : (
            <div className="space-y-2">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {s.name}
                  </span>
                  <input
                    type="hidden"
                    name={`status_${s.id}`}
                    value={marks[s.id]}
                  />
                  <div className="flex gap-1.5">
                    {STATUSES.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setMarks((m) => ({ ...m, [s.id]: st }))}
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold ring-1 transition ${
                          marks[s.id] === st
                            ? STATUS_STYLE[st]
                            : "bg-slate-50 text-slate-400 ring-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {st.charAt(0) + st.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {students.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
              >
                {pending ? "Saving…" : "Save Attendance"}
              </button>
              {state?.ok && (
                <span className="text-sm font-medium text-green-600">
                  ✓ Saved
                </span>
              )}
              {state?.error && (
                <span className="text-sm font-medium text-red-600">
                  {state.error}
                </span>
              )}
            </div>
          )}
        </Card>
      </form>
    </div>
  );
}
