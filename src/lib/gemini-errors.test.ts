import { GoogleGenerativeAIFetchError } from "@google/generative-ai";
import { describe, expect, it } from "vitest";

import { GeminiConfigError } from "@/lib/gemini";
import { getGeminiErrorMessage } from "@/lib/gemini-errors";

describe("getGeminiErrorMessage", () => {
  it("handles missing config", () => {
    expect(getGeminiErrorMessage(new GeminiConfigError())).toContain(
      "GEMINI_API_KEY",
    );
  });

  it("handles rate limit", () => {
    const error = new GoogleGenerativeAIFetchError("rate limit", 429);
    expect(getGeminiErrorMessage(error)).toContain("rate limit");
  });

  it("handles invalid API key", () => {
    const error = new GoogleGenerativeAIFetchError("unauthorized", 401);
    expect(getGeminiErrorMessage(error)).toContain("Invalid Gemini API key");
  });

  it("handles quota in error message", () => {
    expect(
      getGeminiErrorMessage(new Error("RESOURCE_EXHAUSTED: quota exceeded")),
    ).toContain("quota");
  });

  it("falls back for unknown errors", () => {
    expect(getGeminiErrorMessage(new Error("boom"))).toContain(
      "AI request failed",
    );
  });
});
