import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/job-match/generate", () => ({
  generateJobMatch: vi.fn(),
}));

vi.mock("@/lib/agent/remote-jobs", () => ({
  searchRemoteJobs: vi.fn(),
}));

vi.mock("@/lib/cover-letter/generate", () => ({
  generateCoverLetterText: vi.fn(),
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
import { EVAL_USER } from "./helpers";

const application = {
  id: "app_eval",
  userId: EVAL_USER.userId,
  company: "Northwind",
  title: "Full Stack Engineer",
  location: "Remote",
  url: null,
  status: "APPLIED" as const,
  salary: null,
  notes: null as string | null,
  appliedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const resume = {
  id: "res_eval",
  userId: EVAL_USER.userId,
  fileName: "eval.pdf",
  mimeType: "application/pdf",
  fileSize: 1200,
  storageKey: "key",
  extractedText:
    "Engineer with React, TypeScript, Node.js, and PostgreSQL. Shipped REST APIs.",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const jd =
  "Full Stack Engineer: React, TypeScript, Node.js, PostgreSQL, REST APIs. Docker and Kubernetes preferred. 4+ years experience.";

describe("eval: job match", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(findLatestCoverLetterJobDescription).mockResolvedValue(null);
    vi.mocked(getApplicationById).mockResolvedValue(application);
    vi.mocked(getLatestResume).mockResolvedValue(resume);
  });

  it("scores a strong match fixture", async () => {
    vi.mocked(generateJobMatch).mockResolvedValue({
      score: 88,
      recommendation: "strong",
      matchingSkills: ["React", "TypeScript", "PostgreSQL", "REST APIs"],
      missingOrWeakerSkills: ["Docker — not mentioned in resume"],
      experienceGaps: [],
      strengths: ["Strong overlap with core stack"],
      summary: "Strong match.",
      scoringNotes: "Required skills covered.",
    });

    const result = await analyzeJobMatchCapability(EVAL_USER, {
      applicationId: "app_eval",
      jobDescription: jd,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.match.recommendation).toBe("strong");
      expect(result.data.match.score).toBeGreaterThanOrEqual(80);
    }
  });

  it("scores a partial match fixture", async () => {
    vi.mocked(generateJobMatch).mockResolvedValue({
      score: 55,
      recommendation: "partial",
      matchingSkills: ["React"],
      missingOrWeakerSkills: [
        "Kubernetes — not mentioned in resume",
        "Docker — not mentioned in resume",
      ],
      experienceGaps: ["Job asks for 4+ years; resume evidence is limited"],
      strengths: ["Some frontend overlap"],
      summary: "Partial match.",
      scoringNotes: "Core gaps on devops.",
    });

    const result = await analyzeJobMatchCapability(EVAL_USER, {
      applicationId: "app_eval",
      jobDescription: jd,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.match.recommendation).toBe("partial");
    }
  });

  it("scores a weak match fixture", async () => {
    vi.mocked(generateJobMatch).mockResolvedValue({
      score: 28,
      recommendation: "weak",
      matchingSkills: [],
      missingOrWeakerSkills: ["Most required skills not mentioned in resume"],
      experienceGaps: ["Seniority requirements not evidenced"],
      strengths: ["Limited transferable signals"],
      summary: "Weak match.",
      scoringNotes: "Low required-skill coverage.",
    });

    const result = await analyzeJobMatchCapability(EVAL_USER, {
      applicationId: "app_eval",
      jobDescription: jd,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.match.score).toBeLessThan(45);
    }
  });

  it("fails closed on missing resume", async () => {
    vi.mocked(getLatestResume).mockResolvedValue(null);
    const result = await analyzeJobMatchCapability(EVAL_USER, {
      applicationId: "app_eval",
      jobDescription: jd,
    });
    expect(result.ok).toBe(false);
  });

  it("fails closed on missing job description", async () => {
    const result = await analyzeJobMatchCapability(EVAL_USER, {
      applicationId: "app_eval",
    });
    expect(result.ok).toBe(false);
  });

  it("rejects invalid application ids", async () => {
    const result = await analyzeJobMatchCapability(EVAL_USER, {
      applicationId: "",
      jobDescription: jd,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects foreign application ids", async () => {
    vi.mocked(getApplicationById).mockResolvedValue(null);
    const result = await analyzeJobMatchCapability(EVAL_USER, {
      applicationId: "not_yours",
      jobDescription: jd,
    });
    expect(result).toEqual({
      ok: false,
      error: "Application not found for this user.",
    });
  });

  it("surfaces malformed AI JSON safely", async () => {
    vi.mocked(generateJobMatch).mockRejectedValue(
      new Error("The AI returned invalid JSON for the job match."),
    );
    const result = await analyzeJobMatchCapability(EVAL_USER, {
      applicationId: "app_eval",
      jobDescription: jd,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/invalid JSON/i);
    }
  });

  it("does not invent candidate experience in gaps phrasing expectations", async () => {
    vi.mocked(generateJobMatch).mockResolvedValue({
      score: 60,
      recommendation: "partial",
      matchingSkills: ["React"],
      missingOrWeakerSkills: ["AWS — not mentioned in resume"],
      experienceGaps: ["3+ years cloud experience not mentioned in resume"],
      strengths: ["Frontend fundamentals evidenced"],
      summary: "Partial match; cloud experience not evidenced.",
      scoringNotes: "Preferred cloud skills absent from resume text.",
    });

    const result = await analyzeJobMatchCapability(EVAL_USER, {
      applicationId: "app_eval",
      jobDescription: jd,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const blob = [
        ...result.data.match.missingOrWeakerSkills,
        ...result.data.match.experienceGaps,
        result.data.match.summary,
      ].join(" ");
      expect(blob.toLowerCase()).toMatch(/not mentioned|not evidenced|absent/);
      expect(blob.toLowerCase()).not.toMatch(
        /candidate has never used|definitely lacks/,
      );
    }
  });
});
