// Landing / home page — public.
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-6 text-center">
      <div className="max-w-2xl">
        <div className="mb-4 inline-block rounded-full bg-brand/10 px-4 py-1 text-sm font-semibold text-brand">
          School ERP for Bangalore
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
          School<span className="text-brand">Setu</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          One secure place for students, attendance, and fees — bridging
          schools, teachers, and parents.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-brand px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-dark"
          >
            Log in
          </Link>
          <Link
            href="/api/health"
            className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            System status
          </Link>
        </div>
        <p className="mt-10 text-xs text-slate-400">
          Secure • Role-based access • Built for Indian schools (CBSE, ₹,
          Jun–Apr year)
        </p>
      </div>
    </main>
  );
}
