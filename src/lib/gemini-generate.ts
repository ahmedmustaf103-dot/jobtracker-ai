import {
  GoogleGenerativeAIFetchError,
  type GenerativeModel,
} from "@google/generative-ai";

import { getGeminiClient, GEMINI_MODEL } from "@/lib/gemini";

const DEFAULT_SYSTEM_INSTRUCTION =
  "You write tailored, professional cover letters. Output plain text only.";

const FALLBACK_MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
] as const;

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1200;

export type GeminiGenerateOptions = {
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
  /** When set, asks Gemini for structured output (e.g. application/json). */
  responseMimeType?: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(error: unknown): boolean {
  if (error instanceof GoogleGenerativeAIFetchError) {
    return error.status === 429 || error.status === 503 || error.status === 500;
  }
  return false;
}

function createModel(
  modelName: string,
  options: GeminiGenerateOptions = {},
): GenerativeModel {
  return getGeminiClient().getGenerativeModel({
    model: modelName,
    systemInstruction: options.systemInstruction ?? DEFAULT_SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 800,
      ...(options.responseMimeType
        ? { responseMimeType: options.responseMimeType }
        : {}),
    },
  });
}

function modelChain(): string[] {
  const primary = GEMINI_MODEL.trim();
  const chain = [primary, ...FALLBACK_MODELS.filter((m) => m !== primary)];
  return [...new Set(chain)];
}

export async function generateWithGemini(
  prompt: string,
  options: GeminiGenerateOptions = {},
): Promise<string> {
  let lastError: unknown;

  for (const modelName of modelChain()) {
    const model = createModel(modelName, options);

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const content = result.response.text().trim();

        if (!content) {
          throw new Error("The AI returned an empty response.");
        }

        return content;
      } catch (error) {
        lastError = error;

        if (isRetryable(error) && attempt < MAX_ATTEMPTS - 1) {
          await sleep(RETRY_DELAY_MS * (attempt + 1));
          continue;
        }

        if (isRetryable(error)) {
          break;
        }

        throw error;
      }
    }
  }

  throw lastError ?? new Error("AI request failed.");
}
