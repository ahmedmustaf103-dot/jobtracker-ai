import type { Metadata } from "next";
import { PenLine } from "lucide-react";

import { CoverLetterGenerator } from "@/components/cover-letters/cover-letter-generator";
import { CoverLetterHistoryItem } from "@/components/cover-letters/cover-letter-history-item";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { formatCountLabel } from "@/lib/format";
import { getSession } from "@/lib/auth/session";
import { listCoverLetters } from "@/server/services/cover-letters.service";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Cover letters",
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
        title="Cover letters"
        description="Generate tailored drafts from job descriptions, then edit and save them."
      />

      <CoverLetterGenerator />

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">
            Saved letters
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {letters.length > 0
              ? formatCountLabel(letters.length, "saved letter", "saved letters")
              : "Generated letters appear here after you create them."}
          </p>
        </div>
        {letters.length === 0 ? (
          <EmptyState
            icon={PenLine}
            title="No saved letters yet"
            description="Generate a cover letter above — it will be saved automatically."
          />
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
