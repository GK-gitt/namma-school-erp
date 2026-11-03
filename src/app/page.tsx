// Landing / home page — public, Kannada-branded.
import Link from "next/link";
import { Logo } from "@/components/logo";
import {
  CalendarCheck,
  Wallet,
  MessageCircle,
  GraduationCap,
  ArrowRight,
  HeartPulse,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-kannada-soft">
      {/* top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <Logo size={40} />
          <span className="text-xl font-extrabold text-slate-900">
            Namma School ERP
          </span>
        </div>
        <Link
          href="/login"
          className="rounded-xl bg-kannada-gradient px-5 py-2 text-sm font-bold text-white shadow-warm transition hover:opacity-95"
        >
          Log in
        </Link>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-12 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-kesari shadow-sm ring-1 ring-kesari/10">
          🧡 Built for Bengaluru schools
        </div>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          One source of truth
          <br />
          for the{" "}
          <span className="bg-kannada-gradient bg-clip-text text-transparent">
            entire school.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          One beautiful platform for admins, teachers, students & parents —
          attendance, fees, and report cards, all in one place.{" "}
          <span className="font-semibold text-slate-800">
            ನಮ್ಮ ಶಾಲೆ, ನಮ್ಮ ಭವಿಷ್ಯ.
          </span>
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-kannada-gradient px-7 py-3.5 text-base font-bold text-white shadow-warm transition hover:opacity-95"
          >
            Get started <ArrowRight size={18} />
          </Link>
          <Link
            href="/api/health"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            <HeartPulse size={18} className="text-malnad" /> System status
          </Link>
        </div>
      </section>

      {/* feature cards */}
      <section className="mx-auto grid max-w-5xl gap-5 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon={<CalendarCheck />}
          title="Smart Attendance"
          desc="Mark a whole class in one tap. Trends & alerts included."
          color="text-kesari"
          bg="bg-kesari-50"
        />
        <FeatureCard
          icon={<Wallet />}
          title="Fees & UPI"
          desc="One-tap payments. Instant receipts. Zero paperwork."
          color="text-haldi-dark"
          bg="bg-haldi-50"
        />
        <FeatureCard
          icon={<MessageCircle />}
          title="WhatsApp-first"
          desc="Report cards & receipts shared instantly on WhatsApp."
          color="text-malnad"
          bg="bg-green-50"
        />
        <FeatureCard
          icon={<GraduationCap />}
          title="For Everyone"
          desc="Role-based access for admins, teachers, students & parents."
          color="text-kesari"
          bg="bg-kesari-50"
        />
      </section>

      <footer className="pb-10 text-center text-xs text-slate-400">
        Made with 🧡 in Bengaluru, Karnataka · Namma School ERP
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  color,
  bg,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-warm">
      <div
        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${bg} ${color}`}
      >
        {icon}
      </div>
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </div>
  );
}
