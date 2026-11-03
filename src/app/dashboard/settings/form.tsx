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
};

const inputCls =
  "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-kesari focus:ring-2 focus:ring-kesari/20";

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
          <p className="sm:col-span-2 rounded-xl bg-kesari-50 px-3 py-2 text-sm text-kesari-dark">
            {state.error}
          </p>
        )}
        {state?.ok && (
          <p className="sm:col-span-2 rounded-xl bg-green-50 px-3 py-2 text-sm text-malnad">
            ✓ Settings saved!
          </p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-kannada-gradient px-6 py-2.5 text-sm font-bold text-white shadow-warm transition hover:opacity-95 disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save Settings"}
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
