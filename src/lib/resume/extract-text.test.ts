import { beforeEach, describe, expect, it, vi } from "vitest";

const getDocumentProxy = vi.fn();
const extractText = vi.fn();

vi.mock("unpdf", () => ({
  getDocumentProxy,
  extractText,
}));

vi.mock("mammoth", () => ({
  default: {
    extractRawText: vi.fn(async () => ({
      value: "A ".repeat(40) + "DOCX resume content for analysis.",
    })),
  },
}));

describe("extractResumeText", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("extracts PDF text via unpdf (serverless-safe path)", async () => {
    getDocumentProxy.mockResolvedValue({ id: "pdf" });
    extractText.mockResolvedValue({
      totalPages: 1,
      text: "A ".repeat(40) + "PDF resume content for analysis.",
    });

    const { extractResumeText } = await import("@/lib/resume/extract-text");
    const text = await extractResumeText(
      Buffer.from("%PDF-1.4"),
      "application/pdf",
    );

    expect(getDocumentProxy).toHaveBeenCalledOnce();
    expect(extractText).toHaveBeenCalledOnce();
    expect(text.length).toBeGreaterThanOrEqual(50);
    expect(text).toContain("PDF resume content");
  });

  it("rejects PDFs that yield too little text", async () => {
    getDocumentProxy.mockResolvedValue({ id: "pdf" });
    extractText.mockResolvedValue({ totalPages: 1, text: "too short" });

    const { extractResumeText } = await import("@/lib/resume/extract-text");
    await expect(
      extractResumeText(Buffer.from("%PDF-1.4"), "application/pdf"),
    ).rejects.toThrow(/enough text/i);
  });
});
