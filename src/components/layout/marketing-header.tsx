"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Preview", href: "#showcase" },
  { label: "Pricing", href: "#pricing" },
];

export function MarketingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size="sm" />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Marketing">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm text-zinc-400 transition-colors hover:text-zinc-50 sm:inline"
          >
            Sign in
          </Link>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/register">Create account</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-300 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/[0.06] bg-background transition-all md:hidden",
          open ? "max-h-80" : "max-h-0 border-t-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Marketing mobile">
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
          <div className="mt-2 flex flex-col gap-2 border-t border-white/[0.06] pt-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/login" onClick={() => setOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/register" onClick={() => setOpen(false)}>
                Create account
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
