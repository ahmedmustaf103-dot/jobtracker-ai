import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/cover-letter/generate", () => ({
  generateCoverLetterText: vi.fn(),
}));

vi.mock("@/server/services/cover-letters.service", () => ({
  createCoverLetter: vi.fn(),
}));

vi.mock("@/lib/agent/remote-jobs", () => ({
  searchRemoteJobs: vi.fn(),
}));

vi.mock("@/server/services/applications.service", () => ({
  createApplication: vi.fn(),
  getApplicationStats: vi.fn(),
  getApplicationWithEvents: vi.fn(),
  listApplications: vi.fn(),
  updateApplication: vi.fn(),
  updateApplicationStatus: vi.fn(),
}));

import { generateCoverLetterCapability } from "@/lib/capabilities/handlers";
import { generateCoverLetterText } from "@/lib/cover-letter/generate";
import { GeminiConfigError } from "@/lib/gemini";
import { createCoverLetter } from "@/server/services/cover-letters.service";
import { EVAL_USER } from "./helpers";

const validInput = {
  company: "Northwind Labs",
  role: "Frontend Engineer",
  jobDescription:
    "We need a frontend engineer experienced with React, TypeScript, and accessible UI who can ship polished product features with designers and backend partners.",
};

describe("eval: cover letter path", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates before calling Gemini", async () => {
    const result = await generateCoverLetterCapability(EVAL_USER, {
      company: "Acme",
      role: "Eng",
      jobDescription: "short",
    });
    expect(result.ok).toBe(false);
    expect(generateCoverLetterText).not.toHaveBeenCalled();
    expect(createCoverLetter).not.toHaveBeenCalled();
  });

  it("generates and saves on success", async () => {
    vi.mocked(generateCoverLetterText).mockResolvedValue(
      "A full cover letter body that is long enough for the product path.",
    );
    vi.mocked(createCoverLetter).mockResolvedValue({
      id: "cl_1",
      userId: EVAL_USER.userId,
      company: validInput.company,
      role: validInput.role,
      jobDescription: validInput.jobDescription,
      content: "A full cover letter body that is long enough for the product path.",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await generateCoverLetterCapability(EVAL_USER, validInput);
    expect(result.ok).toBe(true);
    expect(generateCoverLetterText).toHaveBeenCalledWith(
      expect.objectContaining({
        candidateName: EVAL_USER.candidateName,
        company: validInput.company,
      }),
    );
    expect(createCoverLetter).toHaveBeenCalled();
    if (result.ok) {
      expect(result.data.coverLetter.id).toBe("cl_1");
    }
  });

  it("maps Gemini config errors to safe messages", async () => {
    vi.mocked(generateCoverLetterText).mockRejectedValue(
      new GeminiConfigError(),
    );

    const result = await generateCoverLetterCapability(EVAL_USER, validInput);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/GEMINI_API_KEY/i);
    }
    expect(createCoverLetter).not.toHaveBeenCalled();
  });
});
