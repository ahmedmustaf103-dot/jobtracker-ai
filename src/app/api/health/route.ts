import { NextResponse } from "next/server";

import { isValidGeminiApiKeyFormat } from "@/lib/gemini";

/** Public health check — no secrets exposed. */
export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY?.trim() ?? "";

  return NextResponse.json({
    ok: true,
    gemini: {
      configured: apiKey.length > 0,
      formatValid: isValidGeminiApiKeyFormat(apiKey),
    },
  });
}
