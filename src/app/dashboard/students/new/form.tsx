"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createStudent } from "../actions";
import { Card } from "@/components/ui";

export function StudentForm({
  classes,
}: {
  classes: { id: string; label: string }[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createStudent, {});

  // On success, go back to the list.
  useEffect(() => {
    if (state?.ok) router.push("/dashboard/students");
  }, [state, router]);

  return (
    <Card className="max-w-2xl">
      <form
        action={formAction}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <Field label="Admission No *" name="admissionNo" required />
        <Field label="First Name *" name="firstName" required />
        <Field label="Last Name *" name="lastName" required />
        <Field
          label="Date of Birth *"
          name="dateOfBirth"
          type="date"
          required
        />

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Gender *
          </label>
          <select
            name="gender"
            required
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <Field label="Blood Group" name="bloodGroup" placeholder="e.g. O+" />
        <Field label="Guardian Name *" name="guardianName" required />
        <Field
          label="Guardian Phone *"
          name="guardianPhone"
          placeholder="10-digit mobile"
          required
        />

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Class
          </label>
          <select
            name="classId"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5"
          >
            <option value="">— Unassigned —</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Address
          </label>
          <textarea
            name="address"
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5"
          />
        </div>

        {state?.error && (
          <p className="sm:col-span-2 rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700 ring-1 ring-inset ring-rose-100">
            {state.error}
          </p>
        )}

        <div className="sm:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-slate-900 px-5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save Student"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/students")}
            className="rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5"
      />
    </div>
  );
}
