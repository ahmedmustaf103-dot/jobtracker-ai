import { z } from "zod";

export const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_RESUME_MIMES = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
} as const;

export type AllowedResumeMime = keyof typeof ALLOWED_RESUME_MIMES;

const keywordSchema = z.object({
  present: z.array(z.string()),
  missing: z.array(z.string()),
  recommended: z.array(z.string()),
});

export const resumeAnalysisSchema = z.object({
  score: z.number().int().min(0).max(100),
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()).min(1),
  missingSkills: z.array(z.string()),
  atsSuggestions: z.array(z.string()).min(1),
  improvements: z.array(z.string()).min(1),
  keywords: keywordSchema,
});

export type ResumeAnalysisInput = z.infer<typeof resumeAnalysisSchema>;

export const reanalyzeResumeSchema = z.object({
  resumeId: z.string().min(1),
  extractedText: z
    .string()
    .min(100, "Resume text is too short to analyze meaningfully")
    .max(50000, "Resume text is too long"),
});

export function getExtensionFromFileName(fileName: string): string | null {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf" || ext === "docx") return ext;
  return null;
}

export function resolveResumeMimeType(
  file: File,
): AllowedResumeMime | null {
  const mime = file.type as AllowedResumeMime;
  if (mime in ALLOWED_RESUME_MIMES) return mime;

  const ext = getExtensionFromFileName(file.name);
  if (ext === "pdf") return "application/pdf";
  if (ext === "docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  return null;
}

export function validateResumeFile(file: File | null): string | null {
  if (!file || file.size === 0) {
    return "Please upload a PDF or DOCX resume.";
  }
  if (file.size > MAX_RESUME_BYTES) {
    return "File must be 5 MB or smaller.";
  }
  if (!resolveResumeMimeType(file)) {
    return "Only PDF and DOCX files are supported.";
  }
  return null;
}
