import { generateWithGemini } from "@/lib/gemini-generate";

export type CoverLetterGenerationInput = {
  company: string;
  role: string;
  jobDescription: string;
  candidateName: string;
};

export const COVER_LETTER_SYSTEM_INSTRUCTION = `You are an expert cover letter writer for software and tech roles.
You always write complete, submission-ready cover letters — never summaries, outlines, or one-line replies.
Each letter must have four full paragraphs separated by blank lines, roughly 280–420 words total.
Output plain text only — no markdown, headings, or meta commentary.`;

export const COVER_LETTER_GENERATION_OPTIONS = {
  systemInstruction: COVER_LETTER_SYSTEM_INSTRUCTION,
  temperature: 0.75,
  maxOutputTokens: 4096,
} as const;

const MIN_WORDS = 180;
const MIN_PARAGRAPHS = 3;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countParagraphs(text: string): number {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean).length;
}

export function isCoverLetterTooShort(content: string): boolean {
  return (
    countWords(content) < MIN_WORDS || countParagraphs(content) < MIN_PARAGRAPHS
  );
}

function buildPrompt(input: CoverLetterGenerationInput, retryBecauseShort = false) {
  const retryNote = retryBecauseShort
    ? [
        ``,
        `IMPORTANT: Your previous attempt was too short. Write a FULL letter this time — at least 4 paragraphs and 280+ words.`,
      ]
    : [];

  return [
    `Write a tailored, professional cover letter for this job application.`,
    ...retryNote,
    ``,
    `Candidate name: ${input.candidateName}`,
    `Company: ${input.company}`,
    `Role: ${input.role}`,
    ``,
    `Job description:`,
    `"""`,
    input.jobDescription,
    `"""`,
    ``,
    `Required structure (use blank lines between paragraphs):`,
    `1. Opening (3–4 sentences): A specific hook tied to ${input.company} or the ${input.role} role — never open with "I am writing to apply".`,
    `2. Fit & strengths (4–6 sentences): Connect 2–3 requirements from the job description to relevant skills and experience themes. Use confident but honest language; do not invent employers, degrees, or metrics.`,
    `3. Motivation (3–4 sentences): Explain why ${input.company} and this role appeal to you, referencing details from the posting.`,
    `4. Closing (2–3 sentences): Thank the reader, express enthusiasm for next steps, and sign off with the candidate's name.`,
    ``,
    `Quality bar:`,
    `- Target 280–420 words total.`,
    `- Write in first person, professional and warm — not stiff or generic.`,
    `- Reference specific language from the job description where possible.`,
    `- Do not use bullet points, placeholders like [Company], or filler phrases.`,
    `- Return only the finished letter text.`,
  ].join("\n");
}

export async function generateCoverLetterText(
  input: CoverLetterGenerationInput,
): Promise<string> {
  let content = await generateWithGemini(
    buildPrompt(input),
    COVER_LETTER_GENERATION_OPTIONS,
  );

  if (isCoverLetterTooShort(content)) {
    content = await generateWithGemini(
      buildPrompt(input, true),
      COVER_LETTER_GENERATION_OPTIONS,
    );
  }

  if (isCoverLetterTooShort(content)) {
    throw new Error(
      "The AI returned a cover letter that was too short. Try adding more detail to the job description and generate again.",
    );
  }

  return content;
}
