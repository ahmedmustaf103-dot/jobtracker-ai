import type { Metadata } from "next";

import { CoverLetterGenerator } from "@/components/cover-letters/cover-letter-generator";
import { CoverLetterHistoryItem } from "@/components/cover-letters/cover-letter-history-item";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { getSession } from "@/lib/auth/session";
import { listCoverLetters } from "@/server/services/cover-letters.service";

export const metadata: Metadata = {
  title: "AI Cover Letters",
};

export default async function CoverLettersPage() {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const letters = await listCoverLetters(userId);

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="AI Cover Letter Generator"
        description="Paste a job description and get a tailored cover letter in seconds."
      />

      <CoverLetterGenerator />

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-zinc-300">
          Saved cover letters
        </h2>
        {letters.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 py-12 text-center">
            <p className="text-sm text-zinc-400">No saved cover letters yet.</p>
            <p className="mt-1 text-xs text-zinc-500">
              Generated letters are saved here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {letters.map((letter) => (
              <CoverLetterHistoryItem
                key={letter.id}
                id={letter.id}
                company={letter.company}
                role={letter.role}
                content={letter.content}
                createdAt={letter.createdAt.toISOString()}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
