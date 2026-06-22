import { describe, expect, it } from "vitest";

import {
  getExtensionFromFileName,
  resolveResumeMimeType,
  validateResumeFile,
} from "@/validations/resume";

describe("validateResumeFile", () => {
  it("rejects null file", () => {
    expect(validateResumeFile(null)).toBe("Please upload a PDF or DOCX resume.");
  });

  it("rejects empty file", () => {
    const file = new File([], "resume.pdf", { type: "application/pdf" });
    expect(validateResumeFile(file)).toBe("Please upload a PDF or DOCX resume.");
  });

  it("rejects unsupported types", () => {
    const file = new File(["x"], "resume.txt", { type: "text/plain" });
    expect(validateResumeFile(file)).toBe("Only PDF and DOCX files are supported.");
  });

  it("accepts valid PDF", () => {
    const file = new File(["content"], "resume.pdf", { type: "application/pdf" });
    expect(validateResumeFile(file)).toBeNull();
  });
});

describe("resolveResumeMimeType", () => {
  it("falls back to extension when mime is empty", () => {
    const file = new File(["content"], "resume.pdf", { type: "" });
    expect(resolveResumeMimeType(file)).toBe("application/pdf");
  });
});

describe("getExtensionFromFileName", () => {
  it("returns extension for supported files", () => {
    expect(getExtensionFromFileName("my-resume.docx")).toBe("docx");
  });

  it("returns null for unsupported extensions", () => {
    expect(getExtensionFromFileName("resume.txt")).toBeNull();
  });
});
