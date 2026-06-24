import { describe, expect, it } from "vitest";
import OpenAI from "openai";

import { OpenAIConfigError } from "@/lib/openai";
import { getOpenAIErrorMessage } from "@/lib/openai-errors";

describe("getOpenAIErrorMessage", () => {
  it("handles missing config", () => {
    expect(getOpenAIErrorMessage(new OpenAIConfigError())).toContain(
      "not configured",
    );
  });

  it("handles quota exceeded", () => {
    const error = new OpenAI.APIError(429, undefined, "quota exceeded", undefined);
    expect(getOpenAIErrorMessage(error)).toContain("quota exceeded");
  });

  it("handles invalid API key", () => {
    const error = new OpenAI.APIError(401, undefined, "invalid key", undefined);
    expect(getOpenAIErrorMessage(error)).toContain("Invalid OpenAI API key");
  });

  it("falls back for unknown errors", () => {
    expect(getOpenAIErrorMessage(new Error("boom"))).toContain(
      "AI request failed",
    );
  });
});
