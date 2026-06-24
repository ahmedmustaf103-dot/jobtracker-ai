"use server";

import { revalidatePath } from "next/cache";

import { generateCoverLetterText } from "@/lib/cover-letter/generate";
import { getGeminiErrorMessage } from "@/lib/gemini-errors";
import { requireSession } from "@/lib/auth/session";
import { rateLimit, rateLimitMessage } from "@/lib/rate-limit";
import {
  createCoverLetter,
  deleteCoverLetter,
  updateCoverLetterContent,
} from "@/server/services/cover-letters.service";
import {
  parseGenerateCoverLetterForm,
  updateCoverLetterSchema,
} from "@/validations/cover-letter";

export type GeneratedCoverLetter = {
  id: string;
  company: string;
  role: string;
  content: string;
};

export type CoverLetterActionState = {
  error?: string;
  coverLetter?: GeneratedCoverLetter;
};

export async function generateCoverLetterAction(
  _prevState: CoverLetterActionState,
  formData: FormData,
): Promise<CoverLetterActionState> {
  const session = await requireSession();

  const limited = rateLimit(`cover-letter:${session.user.id}`, 10, 60 * 60 * 1000);
  if (!limited.ok) {
    return { error: rateLimitMessage(limited.retryAfterSec) };
  }

  const parsed = parseGenerateCoverLetterForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { company, role, jobDescription } = parsed.data;
  const candidateName = session.user?.name?.trim() || "the candidate";

  let content: string;
  try {
    content = await generateCoverLetterText({
      company,
      role,
      jobDescription,
      candidateName,
    });
  } catch (error) {
    console.error("Cover letter generation failed:", error);
    return { error: getGeminiErrorMessage(error) };
  }

  const saved = await createCoverLetter(session.user.id, {
    company,
    role,
    jobDescription,
    content,
  });

  revalidatePath("/cover-letters");

  return {
    coverLetter: {
      id: saved.id,
      company: saved.company,
      role: saved.role,
      content: saved.content,
    },
  };
}

export type SaveCoverLetterState = {
  error?: string;
  success?: string;
};

export async function updateCoverLetterAction(
  id: string,
  content: string,
): Promise<SaveCoverLetterState> {
  const session = await requireSession();
  const parsed = updateCoverLetterSchema.safeParse({ id, content });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const updated = await updateCoverLetterContent(
    session.user.id,
    parsed.data.id,
    parsed.data.content,
  );

  if (!updated) {
    return { error: "Cover letter not found" };
  }

  revalidatePath("/cover-letters");
  return { success: "Saved" };
}

export async function deleteCoverLetterAction(
  id: string,
): Promise<SaveCoverLetterState> {
  const session = await requireSession();
  const deleted = await deleteCoverLetter(session.user.id, id);

  if (!deleted) {
    return { error: "Cover letter not found" };
  }

  revalidatePath("/cover-letters");
  return { success: "Deleted" };
}
