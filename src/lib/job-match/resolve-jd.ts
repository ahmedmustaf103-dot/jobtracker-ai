export type JobDescriptionSource = "paste" | "notes" | "cover_letter";

export type ResolvedJobDescription = {
  text: string;
  source: JobDescriptionSource;
};

const MIN_JD_CHARS = 40;

/**
 * Resolve job description text for matching without schema changes.
 * Priority: explicit paste → long application notes → matching cover letter JD.
 */
export function resolveJobDescription(input: {
  pasted?: string | null;
  notes?: string | null;
  coverLetterJobDescription?: string | null;
}): ResolvedJobDescription | null {
  const pasted = input.pasted?.trim() ?? "";
  if (pasted.length >= MIN_JD_CHARS) {
    return { text: pasted, source: "paste" };
  }

  const notes = input.notes?.trim() ?? "";
  if (notes.length >= MIN_JD_CHARS) {
    return { text: notes, source: "notes" };
  }

  const cover = input.coverLetterJobDescription?.trim() ?? "";
  if (cover.length >= MIN_JD_CHARS) {
    return { text: cover, source: "cover_letter" };
  }

  return null;
}
