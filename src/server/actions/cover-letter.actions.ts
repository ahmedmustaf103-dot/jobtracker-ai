"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/auth/session";
import { getOpenAI, OpenAIConfigError, OPENAI_MODEL } from "@/lib/openai";
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

function buildPrompt(input: {
  company: string;
  role: string;
  jobDescription: string;
  candidateName: string;
}) {
  return [
    `You are an expert career coach and professional writer.`,
    `Write a tailored, compelling cover letter for the following application.`,
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
    `Guidelines:`,
    `- Keep it concise (3-4 short paragraphs, under 350 words).`,
    `- Open with a strong, specific hook — avoid generic phrases like "I am writing to apply".`,
    `- Connect the candidate's likely strengths to the role's key requirements.`,
    `- Use a confident, professional, and warm tone.`,
    `- Do not invent specific facts, employers, or metrics about the candidate.`,
    `- End with a polite call to action and sign off with the candidate's name.`,
    `- Return only the cover letter text, with no preamble or markdown.`,
  ].join("\n");
}

export async function generateCoverLetterAction(
  _prevState: CoverLetterActionState,
  formData: FormData,
): Promise<CoverLetterActionState> {
  const session = await requireSession();
  const parsed = parseGenerateCoverLetterForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { company, role, jobDescription } = parsed.data;
  const candidateName = session.user?.name?.trim() || "the candidate";

  let content: string;
  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.7,
      max_tokens: 800,
      messages: [
        {
          role: "system",
          content:
            "You write tailored, professional cover letters. Output plain text only.",
        },
        {
          role: "user",
          content: buildPrompt({
            company,
            role,
            jobDescription,
            candidateName,
          }),
        },
      ],
    });

    content = completion.choices[0]?.message?.content?.trim() ?? "";
    if (!content) {
      return { error: "The AI returned an empty response. Please try again." };
    }
  } catch (error) {
    if (error instanceof OpenAIConfigError) {
      return {
        error:
          "AI is not configured yet. Add an OPENAI_API_KEY to your environment to generate cover letters.",
      };
    }
    console.error("Cover letter generation failed:", error);
    return {
      error: "Failed to generate the cover letter. Please try again shortly.",
    };
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
