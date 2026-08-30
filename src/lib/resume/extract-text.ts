import mammoth from "mammoth";

import type { AllowedResumeMime } from "@/validations/resume";

async function extractPdfText(buffer: Buffer): Promise<string> {
  // unpdf ships a serverless PDF.js build (no DOMMatrix / @napi-rs/canvas).
  // pdf-parse v2 crashes on Vercel with ReferenceError: DOMMatrix is not defined.
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return Array.isArray(text) ? text.join("\n") : text;
}

export async function extractResumeText(
  buffer: Buffer,
  mimeType: AllowedResumeMime,
): Promise<string> {
  let text: string;

  try {
    if (mimeType === "application/pdf") {
      text = await extractPdfText(buffer);
    } else {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (
      message.toLowerCase().includes("extract") ||
      message.toLowerCase().includes("invalid pdf")
    ) {
      throw error instanceof Error
        ? error
        : new Error("Could not extract text from this file.");
    }
    throw new Error(
      "Could not extract text from this file. Try a different PDF or DOCX.",
    );
  }

  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length < 50) {
    throw new Error(
      "Could not extract enough text from this file. Try a different PDF or DOCX.",
    );
  }

  return normalized;
}
