"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { siteConfig } from "@/config/site";
import { GithubIcon } from "@/components/marketing/github-icon";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Pricing", href: "#pricing" },
];

export function MarketingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0A0A0A]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight text-zinc-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 text-sm font-bold text-white shadow-lg shadow-violet-900/40">
            JT
          </span>
          {siteConfig.name}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
            >
              {label}
            </Link>
          ))}
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm text-zinc-400 transition-colors hover:text-zinc-50 sm:inline"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="hidden rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-900/40 transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            Start Free
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-300 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-white/[0.06] bg-[#0A0A0A] transition-all md:hidden",
          open ? "max-h-80" : "max-h-0 border-t-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.04]"
            >
              {label}
            </Link>
          ))}
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.04]"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
          <div className="mt-2 flex flex-col gap-2 border-t border-white/[0.06] pt-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-white/10 px-4 py-2.5 text-center text-sm text-zinc-200"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-center text-sm font-medium text-white"
            >
              Start Free
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
