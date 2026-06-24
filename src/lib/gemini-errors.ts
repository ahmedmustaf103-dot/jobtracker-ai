import { GoogleGenerativeAIFetchError } from "@google/generative-ai";

import { GeminiConfigError } from "@/lib/gemini";

/** Map Gemini SDK errors to user-safe messages. */
export function getGeminiErrorMessage(error: unknown): string {
  if (error instanceof GeminiConfigError) {
    return "AI is not configured. Add GEMINI_API_KEY from Google AI Studio to your environment.";
  }

  if (error instanceof GoogleGenerativeAIFetchError) {
    if (error.status === 429) {
      return "Gemini rate limit reached. Wait a moment or check your Google AI Studio quota, then try again.";
    }
    if (error.status === 401 || error.status === 403) {
      return "Invalid Gemini API key. Check GEMINI_API_KEY in your environment variables.";
    }
    if (error.status === 503 || error.status === 500) {
      return "Gemini is temporarily unavailable. Please try again in a few minutes.";
    }
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes("empty response")) {
      return "The AI returned an empty response. Please try again.";
    }
    if (message.includes("quota") || message.includes("resource_exhausted")) {
      return "Gemini quota exceeded. Check usage in Google AI Studio, then try again.";
    }
    if (message.includes("api key") || message.includes("api_key")) {
      return "Invalid Gemini API key. Check GEMINI_API_KEY in your environment variables.";
    }
  }

  return "AI request failed. Please try again shortly.";
}
