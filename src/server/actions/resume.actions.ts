"use server";

import { revalidatePath } from "next/cache";

import { analyzeResumeText } from "@/lib/resume/analyze";
import { extractResumeText } from "@/lib/resume/extract-text";
import { deleteResumeFile, saveResumeFile } from "@/lib/resume/storage";
import { requireSession } from "@/lib/auth/session";
import { OpenAIConfigError } from "@/lib/openai";
import {
  createResume,
  createResumeAnalysis,
  deleteResume,
  deleteResumeAnalysis,
  getResumeById,
  mapAnalysisRecord,
  updateResume,
} from "@/server/services/resumes.service";
import type { ResumeAnalysisRecord } from "@/types/resume";
import {
  ALLOWED_RESUME_MIMES,
  reanalyzeResumeSchema,
  resolveResumeMimeType,
  validateResumeFile,
} from "@/validations/resume";

export type ResumeAnalyzerState = {
  error?: string;
  success?: string;
  analysis?: ResumeAnalysisRecord;
  extractedText?: string;
  resumeId?: string;
};

async function runAnalysis(
  userId: string,
  resumeId: string,
  extractedText: string,
  candidateName: string,
): Promise<ResumeAnalysisRecord> {
  const aiResult = await analyzeResumeText(extractedText, candidateName);
  const saved = await createResumeAnalysis(userId, resumeId, aiResult);
  return mapAnalysisRecord(saved);
}

function handleAiError(error: unknown): string {
  if (error instanceof OpenAIConfigError) {
    return "AI is not configured. Add OPENAI_API_KEY to your environment.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

export async function uploadAndAnalyzeResumeAction(
  _prevState: ResumeAnalyzerState,
  formData: FormData,
): Promise<ResumeAnalyzerState> {
  const session = await requireSession();
  const file = formData.get("resume") as File | null;
  const validationError = validateResumeFile(file);

  if (validationError || !file) {
    return { error: validationError ?? "Invalid file." };
  }

  const mime = resolveResumeMimeType(file);
  if (!mime) {
    return { error: "Only PDF and DOCX files are supported." };
  }

  const extension = ALLOWED_RESUME_MIMES[mime];
  const buffer = Buffer.from(await file.arrayBuffer());
  const candidateName = session.user?.name?.trim() || "the candidate";

  let extractedText: string;
  try {
    extractedText = await extractResumeText(buffer, mime);
  } catch (error) {
    return { error: handleAiError(error) };
  }

  const placeholder = await createResume(session.user.id, {
    fileName: file.name,
    mimeType: mime,
    fileSize: file.size,
    storageKey: "",
    extractedText: "",
  });

  try {
    const storageKey = await saveResumeFile(
      session.user.id,
      placeholder.id,
      buffer,
      extension,
    );

    await updateResume(session.user.id, placeholder.id, {
      storageKey,
      extractedText,
    });

    const analysis = await runAnalysis(
      session.user.id,
      placeholder.id,
      extractedText,
      candidateName,
    );

    revalidatePath("/resume-analyzer");

    return {
      success: "Resume analyzed successfully.",
      analysis,
      extractedText,
      resumeId: placeholder.id,
    };
  } catch (error) {
    await deleteResume(session.user.id, placeholder.id);
    await deleteResumeFile(`${session.user.id}/${placeholder.id}.${extension}`);
    return { error: handleAiError(error) };
  }
}

export async function reanalyzeResumeAction(
  _prevState: ResumeAnalyzerState,
  formData: FormData,
): Promise<ResumeAnalyzerState> {
  const session = await requireSession();
  const parsed = reanalyzeResumeSchema.safeParse({
    resumeId: formData.get("resumeId"),
    extractedText: formData.get("extractedText"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { resumeId, extractedText } = parsed.data;
  const resume = await getResumeById(session.user.id, resumeId);

  if (!resume) {
    return { error: "Resume not found." };
  }

  const candidateName = session.user?.name?.trim() || "the candidate";

  try {
    await updateResume(session.user.id, resumeId, { extractedText });

    const analysis = await runAnalysis(
      session.user.id,
      resumeId,
      extractedText,
      candidateName,
    );

    revalidatePath("/resume-analyzer");

    return {
      success: "Re-analysis complete.",
      analysis,
      extractedText,
      resumeId,
    };
  } catch (error) {
    return { error: handleAiError(error) };
  }
}

export async function deleteResumeAnalysisAction(
  id: string,
): Promise<{ error?: string; success?: string }> {
  const session = await requireSession();
  const deleted = await deleteResumeAnalysis(session.user.id, id);

  if (!deleted) {
    return { error: "Analysis not found." };
  }

  revalidatePath("/resume-analyzer");
  return { success: "Analysis deleted." };
}
