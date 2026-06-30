import { describe, expect, it } from "vitest";

import {
  GeminiKeyFormatError,
  isValidGeminiApiKeyFormat,
} from "@/lib/gemini";

describe("isValidGeminiApiKeyFormat", () => {
  it("accepts Google AI Studio keys", () => {
    expect(isValidGeminiApiKeyFormat("AIzaSyABC123")).toBe(true);
  });

  it("rejects Vertex or other key formats", () => {
    expect(isValidGeminiApiKeyFormat("AQ.Ab8xyz")).toBe(false);
    expect(isValidGeminiApiKeyFormat("sk-openai-style")).toBe(false);
  });

  it("GeminiKeyFormatError explains the expected format", () => {
    expect(new GeminiKeyFormatError().message).toContain("AIzaSy");
  });
});
