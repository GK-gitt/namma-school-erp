"use client";

import { useActionState, useRef, useEffect } from "react";
import { createFeeStructure, recordPayment } from "./actions";

const inputCls =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5";

export function FeeStructureForm({
  classes,
}: {
  classes: { id: string; label: string }[];
}) {
  const [state, action, pending] = useActionState(createFeeStructure, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="space-y-3">
      <input
        name="title"
        placeholder="Title (e.g. Term 1 Tuition)"
        required
        className={inputCls}
      />
      <input
        name="amount"
        type="number"
        step="0.01"
        placeholder="Amount (₹)"
        required
        className={inputCls}
      />
      <input name="dueDate" type="date" required className={inputCls} />
      <input
        name="academicYear"
        defaultValue="2025-2026"
        required
        className={inputCls}
      />
      <select name="classId" required className={inputCls}>
        <option value="">— Select class —</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-slate-900 px-4 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Add Fee Structure"}
      </button>
      {state?.error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.ok && <p className="text-sm text-green-600">✓ Added</p>}
    </form>
  );
}

export function PaymentForm({
  students,
}: {
  students: { id: string; label: string }[];
}) {
  const [state, action, pending] = useActionState(recordPayment, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="space-y-3">
      <select name="studentId" required className={inputCls}>
        <option value="">— Select student —</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
      <input
        name="amount"
        type="number"
        step="0.01"
        placeholder="Amount (₹)"
        required
        className={inputCls}
      />
      <select name="mode" required className={inputCls}>
        <option value="CASH">Cash</option>
        <option value="UPI">UPI</option>
        <option value="CARD">Card</option>
        <option value="NETBANKING">Net Banking</option>
        <option value="CHEQUE">Cheque</option>
      </select>
      <input name="note" placeholder="Note (optional)" className={inputCls} />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-slate-900 px-4 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
      >
        {pending ? "Recording…" : "Record Payment"}
      </button>
      {state?.error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="text-sm text-green-600">✓ Payment recorded</p>
      )}
    </form>
  );
}
