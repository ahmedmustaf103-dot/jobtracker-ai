import { NextResponse } from "next/server";

import { isValidGeminiApiKeyFormat } from "@/lib/gemini";
import {
  getResumeStorageMode,
  hasBlobStorage,
  isResumeAnalyzerEnabled,
} from "@/lib/resume/storage-config";

/** Public health check — no secrets exposed. */
export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY?.trim() ?? "";

  return NextResponse.json({
    ok: true,
    gemini: {
      configured: apiKey.length > 0,
      formatValid: isValidGeminiApiKeyFormat(apiKey),
    },
    resume: {
      enabled: isResumeAnalyzerEnabled(),
      storage: getResumeStorageMode(),
      blobConfigured: hasBlobStorage(),
    },
  });
}
