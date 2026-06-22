import { FileSearch, PenLine, Target } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Logo } from "@/components/ui/logo";

const highlights = [
  {
    icon: Target,
    text: "Track every application from wishlist to offer",
  },
  {
    icon: PenLine,
    text: "Generate cover letters from job descriptions",
  },
  {
    icon: FileSearch,
    text: "Analyse resumes for ATS readiness and gaps",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background text-zinc-100 antialiased">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[140px]" />

      <div className="relative grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between border-r border-white/[0.06] p-10 xl:p-14 lg:flex">
          <Logo href="/" />

          <div className="max-w-md">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-zinc-50">
              Run your job search{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                with clarity
              </span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              {siteConfig.description}
            </p>
            <ul className="mt-8 space-y-4">
              {highlights.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-start gap-3 text-sm text-zinc-300"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15">
                    <Icon className="h-4 w-4 text-violet-300" aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>

        <div className="flex items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center lg:hidden">
              <Logo href="/" />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
