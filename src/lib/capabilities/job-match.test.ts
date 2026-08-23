import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/agent/remote-jobs", () => ({
  searchRemoteJobs: vi.fn(),
}));

vi.mock("@/lib/cover-letter/generate", () => ({
  generateCoverLetterText: vi.fn(),
}));

vi.mock("@/lib/job-match/generate", () => ({
  generateJobMatch: vi.fn(),
}));

vi.mock("@/server/services/applications.service", () => ({
  createApplication: vi.fn(),
  getApplicationById: vi.fn(),
  getApplicationStats: vi.fn(),
  getApplicationWithEvents: vi.fn(),
  listApplications: vi.fn(),
  updateApplication: vi.fn(),
  updateApplicationStatus: vi.fn(),
}));

vi.mock("@/server/services/cover-letters.service", () => ({
  createCoverLetter: vi.fn(),
  findLatestCoverLetterJobDescription: vi.fn(),
}));

vi.mock("@/server/services/resumes.service", () => ({
  getLatestResume: vi.fn(),
}));

import { analyzeJobMatchCapability } from "@/lib/capabilities/handlers";
import { generateJobMatch } from "@/lib/job-match/generate";
import { getApplicationById } from "@/server/services/applications.service";
import { findLatestCoverLetterJobDescription } from "@/server/services/cover-letters.service";
import { getLatestResume } from "@/server/services/resumes.service";

const user = {
  userId: "user_1",
  candidateName: "Alex",
  email: "alex@example.com",
};

const application = {
  id: "app_1",
  userId: "user_1",
  company: "Acme",
  title: "Frontend Engineer",
  location: null,
  url: null,
  status: "WISHLIST" as const,
  salary: null,
  notes: null,
  appliedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const resume = {
  id: "res_1",
  userId: "user_1",
  fileName: "alex.pdf",
  mimeType: "application/pdf",
  fileSize: 1000,
  storageKey: "key",
  extractedText: "Alex built React and TypeScript apps for three years.",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const longJd =
  "We need a Frontend Engineer with React, TypeScript, and REST APIs. AWS preferred. 3+ years experience.";

describe("analyzeJobMatchCapability", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(findLatestCoverLetterJobDescription).mockResolvedValue(null);
  });

  it("rejects foreign / missing applications", async () => {
    vi.mocked(getApplicationById).mockResolvedValue(null);
    const result = await analyzeJobMatchCapability(user, {
      applicationId: "missing",
      jobDescription: longJd,
    });
    expect(result).toEqual({
      ok: false,
      error: "Application not found for this user.",
    });
    expect(generateJobMatch).not.toHaveBeenCalled();
  });

  it("rejects when resume is missing", async () => {
    vi.mocked(getApplicationById).mockResolvedValue(application);
    vi.mocked(getLatestResume).mockResolvedValue(null);
    const result = await analyzeJobMatchCapability(user, {
      applicationId: "app_1",
      jobDescription: longJd,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/resume/i);
    }
  });

  it("rejects when job description is missing", async () => {
    vi.mocked(getApplicationById).mockResolvedValue(application);
    vi.mocked(getLatestResume).mockResolvedValue(resume);
    const result = await analyzeJobMatchCapability(user, {
      applicationId: "app_1",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/job description/i);
    }
  });

  it("returns a validated match on success", async () => {
    vi.mocked(getApplicationById).mockResolvedValue(application);
    vi.mocked(getLatestResume).mockResolvedValue(resume);
    vi.mocked(generateJobMatch).mockResolvedValue({
      score: 78,
      recommendation: "good",
      matchingSkills: ["React", "TypeScript"],
      missingOrWeakerSkills: ["AWS — not mentioned in resume"],
      experienceGaps: [],
      strengths: ["Solid frontend stack"],
      summary: "Good match with a cloud gap.",
      scoringNotes: "Core skills strong; preferred AWS absent.",
    });

    const result = await analyzeJobMatchCapability(user, {
      applicationId: "app_1",
      jobDescription: longJd,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.match.score).toBe(78);
      expect(result.data.dataUsed.resumeFileName).toBe("alex.pdf");
      expect(result.data.dataUsed.jobDescriptionSource).toBe("paste");
    }
  });
});
