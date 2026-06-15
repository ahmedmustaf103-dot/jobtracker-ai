import OpenAI from "openai";

/** Thrown when the OpenAI integration is not configured. */
export class OpenAIConfigError extends Error {
  constructor() {
    super("OpenAI is not configured. Set OPENAI_API_KEY in your environment.");
    this.name = "OpenAIConfigError";
  }
}

export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new OpenAIConfigError();
  }
  client ??= new OpenAI({ apiKey });
  return client;
}
