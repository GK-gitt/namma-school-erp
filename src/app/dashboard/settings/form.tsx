"use client";

import { useActionState } from "react";
import { saveSettings } from "./actions";

type Settings = {
  name: string;
  tagline: string;
  affiliation: string;
  academicYear: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website: string;
  principalName: string;
  upiId: string;
};

const inputCls =
  "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5";

export function SettingsForm({ initial }: { initial: Settings }) {
  const [state, action, pending] = useActionState(saveSettings, {});

  return (
    <div className="max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <form action={action} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="School Name *"
          name="name"
          defaultValue={initial.name}
          required
        />
        <Field label="Tagline" name="tagline" defaultValue={initial.tagline} />
        <Field
          label="Affiliation"
          name="affiliation"
          defaultValue={initial.affiliation}
          placeholder="CBSE / ICSE / State"
        />
        <Field
          label="Academic Year"
          name="academicYear"
          defaultValue={initial.academicYear}
        />
        <Field
          label="Principal Name"
          name="principalName"
          defaultValue={initial.principalName}
        />
        <Field label="Phone" name="phone" defaultValue={initial.phone} />
        <Field
          label="Email"
          name="email"
          defaultValue={initial.email}
          type="email"
        />
        <Field label="Website" name="website" defaultValue={initial.website} />
        <Field label="City" name="city" defaultValue={initial.city} />
        <Field label="State" name="state" defaultValue={initial.state} />
        <Field
          label="UPI ID (for 0%-charge fee collection)"
          name="upiId"
          defaultValue={initial.upiId}
          placeholder="school@okhdfcbank"
        />
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Address
          </label>
          <textarea
            name="address"
            rows={2}
            defaultValue={initial.address}
            className={inputCls}
          />
        </div>

        {state?.error && (
          <p className="sm:col-span-2 rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700 ring-1 ring-inset ring-rose-100">
            {state.error}
          </p>
        )}
        {state?.ok && (
          <p className="sm:col-span-2 rounded-lg bg-emerald-50 px-3 py-2 text-[13px] text-emerald-700 ring-1 ring-inset ring-emerald-100">
            ✓ Settings saved
          </p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-slate-900 px-5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className={inputCls}
      />
    </div>
  );
}
