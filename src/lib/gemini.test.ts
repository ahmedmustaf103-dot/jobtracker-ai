import { describe, expect, it } from "vitest";

import {
  GeminiKeyFormatError,
  isValidGeminiApiKeyFormat,
} from "@/lib/gemini";

describe("isValidGeminiApiKeyFormat", () => {
  it("accepts legacy Google AI Studio keys", () => {
    expect(isValidGeminiApiKeyFormat("AIzaSyABC123")).toBe(true);
  });

  it("accepts new auth keys from AI Studio", () => {
    expect(isValidGeminiApiKeyFormat("AQ.Ab8xyz")).toBe(true);
  });

  it("rejects unknown key formats", () => {
    expect(isValidGeminiApiKeyFormat("sk-openai-style")).toBe(false);
    expect(isValidGeminiApiKeyFormat("")).toBe(false);
  });

  it("GeminiKeyFormatError explains the expected format", () => {
    expect(new GeminiKeyFormatError().message).toContain("AI Studio");
  });
});
