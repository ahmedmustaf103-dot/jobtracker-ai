import Link from "next/link";

import { siteConfig } from "@/config/site";
import { GithubIcon } from "@/components/marketing/github-icon";
import { Logo } from "@/components/ui/logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Sign in", href: "/login" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Create account", href: "/register" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo size="sm" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
              {siteConfig.description}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-zinc-200">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 transition-colors hover:text-zinc-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-zinc-200"
          >
            <GithubIcon className="h-4 w-4" aria-hidden="true" />
            Source on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
