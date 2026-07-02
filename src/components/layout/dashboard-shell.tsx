"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export function DashboardShell({
  children,
  resumeAnalyzerEnabled = false,
}: {
  children: React.ReactNode;
  resumeAnalyzerEnabled?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-zinc-100 lg:flex-row">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none fixed -top-40 right-0 h-[420px] w-[620px] rounded-full bg-violet-700/10 blur-[140px]" />

      <div className="relative z-40 flex h-14 items-center justify-between border-b border-white/[0.06] bg-surface/95 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-300"
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Logo showName href="/dashboard" size="sm" />
        <div className="w-9" aria-hidden="true" />
      </div>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <DashboardSidebar
        resumeAnalyzerEnabled={resumeAnalyzerEnabled}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 -translate-x-full transition-transform lg:static lg:z-auto lg:translate-x-0",
          mobileOpen && "translate-x-0",
        )}
        onNavigate={() => setMobileOpen(false)}
        mobileClose={
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-400 lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" />
          </button>
        }
      />

      <div className="relative flex flex-1 flex-col">
        <main id="main-content" className="flex-1 p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
