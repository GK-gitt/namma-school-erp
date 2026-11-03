// Platform console — only for SUPER_ADMIN (the SaaS owner).
// Shows all schools on the platform. This is the "tenant management" view.
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/dashboard/logout-action";
import { Logo } from "@/components/logo";
import { School as SchoolIcon, Users, GraduationCap } from "lucide-react";

export default async function PlatformPage() {
  await requireRole(["SUPER_ADMIN"]);

  const schools = await prisma.school.findMany({
    include: {
      _count: { select: { students: true, users: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalStudents = schools.reduce((s, c) => s + c._count.students, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Logo size={36} />
          <div>
            <p className="font-extrabold text-slate-900">Namma School ERP</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-kesari">
              Platform Console
            </p>
          </div>
        </div>
        <form action={logoutAction}>
          <button className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
            Log out
          </button>
        </form>
      </header>

      <main className="mx-auto max-w-5xl p-8">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Platform Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          All schools using Namma School ERP
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat
            icon={<SchoolIcon />}
            label="Schools"
            value={String(schools.length)}
          />
          <Stat
            icon={<GraduationCap />}
            label="Total Students"
            value={String(totalStudents)}
          />
          <Stat
            icon={<Users />}
            label="Total Users"
            value={String(schools.reduce((s, c) => s + c._count.users, 0))}
          />
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["School", "Slug", "City", "Plan", "Students", "Users"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-semibold text-slate-600"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schools.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{s.slug}</td>
                  <td className="px-4 py-3 text-slate-600">{s.city}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-haldi-50 px-2.5 py-0.5 text-xs font-semibold text-haldi-dark">
                      {s.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {s._count.students}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s._count.users}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-kesari-50 text-kesari">
        {icon}
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
