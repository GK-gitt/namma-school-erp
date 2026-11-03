import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold text-slate-300">403</h1>
      <p className="mt-2 text-xl font-semibold text-slate-700">Access denied</p>
      <p className="mt-1 text-slate-500">
        Your account role does not have permission to view this page.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 font-semibold text-brand hover:underline"
      >
        Go to my dashboard
      </Link>
    </main>
  );
}
