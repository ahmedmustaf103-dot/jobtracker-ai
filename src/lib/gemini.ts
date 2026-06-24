import { GoogleGenerativeAI } from "@google/generative-ai";

/** Thrown when the Gemini integration is not configured. */
export class GeminiConfigError extends Error {
  constructor() {
    super("Gemini is not configured. Set GEMINI_API_KEY in your environment.");
    this.name = "GeminiConfigError";
  }
}

/** Stable Gemini 2.5 Flash — free tier via Google AI Studio. */
export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

const SYSTEM_INSTRUCTION =
  "You write tailored, professional cover letters. Output plain text only.";

let client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiConfigError();
  }
  client ??= new GoogleGenerativeAI(apiKey);
  return client;
}

export function getCoverLetterModel() {
  return getGeminiClient().getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
    },
  });
}
