import OpenAI from "openai";

import { OpenAIConfigError } from "@/lib/openai";

/** Map OpenAI SDK errors to user-safe messages. */
export function getOpenAIErrorMessage(error: unknown): string {
  if (error instanceof OpenAIConfigError) {
    return "AI is not configured. Add OPENAI_API_KEY to your environment.";
  }

  if (error instanceof OpenAI.APIError) {
    if (error.status === 429) {
      return "OpenAI quota exceeded. Add billing or credits at platform.openai.com, then try again.";
    }
    if (error.status === 401) {
      return "Invalid OpenAI API key. Check OPENAI_API_KEY in your Vercel environment variables.";
    }
    if (error.status === 403) {
      return "OpenAI access denied for this API key. Verify billing and model access.";
    }
    if (error.status === 503 || error.status === 500) {
      return "OpenAI is temporarily unavailable. Please try again in a few minutes.";
    }
  }

  return "AI request failed. Please try again shortly.";
}
