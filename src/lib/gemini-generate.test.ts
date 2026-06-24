import { GoogleGenerativeAIFetchError } from "@google/generative-ai";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

const generateContent = vi.fn();

vi.mock("@/lib/gemini", () => ({
  GEMINI_MODEL: "gemini-test-primary",
  getGeminiClient: () => ({
    getGenerativeModel: () => ({ generateContent }),
  }),
}));

describe("generateWithGemini", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    generateContent.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("retries on 503 then succeeds", async () => {
    const { generateWithGemini } = await import("@/lib/gemini-generate");

    generateContent
      .mockRejectedValueOnce(new GoogleGenerativeAIFetchError("overload", 503))
      .mockResolvedValueOnce({
        response: { text: () => "Dear hiring manager," },
      });

    const promise = generateWithGemini("test prompt");
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe("Dear hiring manager,");
    expect(generateContent).toHaveBeenCalledTimes(2);
  });

  it("throws after exhausting retries and fallbacks", async () => {
    const { generateWithGemini } = await import("@/lib/gemini-generate");

    generateContent.mockRejectedValue(
      new GoogleGenerativeAIFetchError("overload", 503),
    );

    const promise = generateWithGemini("test prompt");
    const rejection = expect(promise).rejects.toBeInstanceOf(
      GoogleGenerativeAIFetchError,
    );
    await vi.runAllTimersAsync();
    await rejection;
  });
});
