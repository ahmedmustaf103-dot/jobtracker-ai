import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const included = [
  "Unlimited application tracking",
  "Interview & offer management",
  "Analytics dashboard",
  "AI job search assistant",
];

export function CtaSection() {
  return (
    <section id="pricing" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#14101f] to-[#0d0d10] p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-violet-700/25 blur-[120px]" />

          <div className="relative">
            <span className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1.5 text-xs font-medium text-violet-200">
              Simple pricing
            </span>

            <div className="mt-6 flex items-end justify-center gap-2">
              <span className="text-5xl font-bold tracking-tight text-zinc-50">
                £20
              </span>
              <span className="mb-1.5 text-zinc-400">/month</span>
            </div>
            <p className="mt-3 text-zinc-400">
              One plan, everything included. Cancel anytime.
            </p>

            <ul className="mx-auto mt-8 grid max-w-md gap-3 text-left sm:grid-cols-2">
              {included.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-zinc-300"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/15">
                    <Check className="h-3 w-3 text-violet-300" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-900/40 transition-transform hover:scale-[1.03]"
              >
                Start Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/[0.07]"
              >
                Sign in
              </Link>
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              14-day free trial · No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
