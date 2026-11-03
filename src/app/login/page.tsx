"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Logo } from "@/components/logo";
import {
  GraduationCap,
  CalendarCheck,
  Wallet,
  MessageCircle,
  Mail,
  Lock,
} from "lucide-react";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <main className="flex min-h-screen">
      {/* ── LEFT: Kannada-gradient hero panel ── */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-kannada-gradient p-12 text-white lg:flex">
        {/* decorative circles */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-white/10" />

        <div className="relative flex items-center gap-3">
          <div className="rounded-2xl bg-white/15 p-2 backdrop-blur">
            <Logo size={44} />
          </div>
          <div>
            <p className="text-2xl font-extrabold">Namma School ERP</p>
            <p className="text-sm text-white/80">ನಮ್ಮ ಶಾಲೆ, ನಮ್ಮ ಭವಿಷ್ಯ</p>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-extrabold leading-tight">
            Bringing Every School
            <br />
            Operation Together.
          </h1>
          <p className="mt-3 max-w-md text-lg text-white/85">
            One beautiful platform connecting admins, teachers, students &
            parents — Namma Shaale, Namma Future.
          </p>

          <div className="mt-8 space-y-3">
            <Feature
              icon={<CalendarCheck size={20} />}
              text="Attendance in one tap"
            />
            <Feature
              icon={<Wallet size={20} />}
              text="Fees & UPI payments, simplified"
            />
            <Feature
              icon={<MessageCircle size={20} />}
              text="Report cards & receipts on WhatsApp"
            />
            <Feature
              icon={<GraduationCap size={20} />}
              text="One login for every role"
            />
          </div>
        </div>

        <p className="relative text-xs text-white/60">
          Made with 🧡 in Bengaluru, Karnataka
        </p>
      </div>

      {/* ── RIGHT: login card ── */}
      <div className="flex w-full items-center justify-center bg-kannada-soft px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <Logo size={40} />
            <span className="text-xl font-extrabold text-slate-900">
              Namma School ERP
            </span>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-warm ring-1 ring-black/5">
            <h2 className="text-2xl font-bold text-slate-900">
              Welcome back 👋
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Log in to your school dashboard
            </p>

            <form action={formAction} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@school.edu"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-kesari focus:ring-2 focus:ring-kesari/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-kesari focus:ring-2 focus:ring-kesari/20"
                  />
                </div>
              </div>

              {state?.error && (
                <p className="rounded-xl bg-kesari-50 px-3 py-2 text-sm text-kesari-dark">
                  {state.error}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-xl bg-kannada-gradient px-4 py-3 text-sm font-bold text-white shadow-warm transition hover:opacity-95 disabled:opacity-60"
              >
                {pending ? "Signing in…" : "Log in →"}
              </button>
            </form>

            <div className="mt-6 rounded-xl bg-haldi-50 p-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">✨ Demo accounts:</p>
              <p className="mt-1">👑 admin@school.edu / Admin@123</p>
              <p>👨‍🏫 teacher@school.edu / Teacher@123</p>
              <p>👪 parent@school.edu / Parent@123</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
        {icon}
      </div>
      <span className="text-white/90">{text}</span>
    </div>
  );
}
