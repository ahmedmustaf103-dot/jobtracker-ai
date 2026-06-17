import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

import type { AllowedResumeMime } from "@/validations/resume";

export async function extractResumeText(
  buffer: Buffer,
  mimeType: AllowedResumeMime,
): Promise<string> {
  let text: string;

  if (mimeType === "application/pdf") {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      text = result.text;
    } finally {
      await parser.destroy();
    }
  } else {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  }

  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length < 50) {
    throw new Error(
      "Could not extract enough text from this file. Try a different PDF or DOCX.",
    );
  }

  return normalized;
}
