"use client";

import { useActionState, useRef, useEffect } from "react";
import { createClass } from "./actions";
import { Card } from "@/components/ui";

export function ClassForm({
  teachers,
}: {
  teachers: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(createClass, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Add a class</h3>
      <form
        ref={formRef}
        action={formAction}
        className="grid grid-cols-1 gap-3 sm:grid-cols-5"
      >
        <input
          name="name"
          placeholder="Class (e.g. Class 5)"
          required
          className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5"
        />
        <input
          name="section"
          placeholder="Section (e.g. A)"
          required
          className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5"
        />
        <input
          name="academicYear"
          placeholder="2025-2026"
          defaultValue="2025-2026"
          required
          className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5"
        />
        <select
          name="classTeacherId"
          className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5"
        >
          <option value="">— Class teacher —</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-slate-900 px-4 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
        >
          {pending ? "Adding…" : "Add"}
        </button>
      </form>
      {state?.error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
    </Card>
  );
}
