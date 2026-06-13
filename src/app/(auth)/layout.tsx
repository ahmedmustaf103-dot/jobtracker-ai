import Link from "next/link";
import { Check } from "lucide-react";

import { siteConfig } from "@/config/site";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";

const highlights = [
  "Track every application from wishlist to offer",
  "Stay on top of interviews and follow-ups",
  "See your pipeline with live analytics",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-zinc-100 antialiased">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[140px]" />

      <div className="relative grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden border-r border-white/[0.06] p-10 xl:p-14 lg:flex">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold tracking-tight text-zinc-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 text-sm font-bold text-white shadow-lg shadow-violet-900/40">
              JT
            </span>
            {siteConfig.name}
          </Link>

          <div className="max-w-md">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-zinc-50">
              Land your next role,{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                faster
              </span>
            </h2>
            <ul className="mt-6 space-y-3">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-zinc-300"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/15">
                    <Check className="h-3 w-3 text-violet-300" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="relative mt-10">
              <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/10 blur-2xl" />
              <DashboardPreview className="relative" />
            </div>
          </div>

          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-8 flex items-center justify-center gap-2.5 font-semibold tracking-tight text-zinc-50 lg:hidden"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 text-sm font-bold text-white">
                JT
              </span>
              {siteConfig.name}
            </Link>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
