import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/gemini-generate", () => ({
  generateWithGemini: vi.fn(),
}));

import { generateWithGemini } from "@/lib/gemini-generate";
import {
  generateJobMatch,
  JOB_MATCH_SYSTEM_INSTRUCTION,
} from "@/lib/job-match/generate";

const baseInput = {
  company: "Acme",
  role: "Frontend Engineer",
  jobDescription:
    "Need React, TypeScript, and 3+ years experience. AWS is a plus.",
  resumeText:
    "Alex — Frontend engineer with React and TypeScript. Built dashboards and REST APIs.",
  candidateName: "Alex",
};

describe("generateJobMatch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("documents anti-invention rules in the system instruction", () => {
    expect(JOB_MATCH_SYSTEM_INSTRUCTION).toMatch(/Never invent/i);
    expect(JOB_MATCH_SYSTEM_INSTRUCTION).toMatch(/not mentioned in resume/i);
  });

  it("parses a strong match JSON response", async () => {
    vi.mocked(generateWithGemini).mockResolvedValue(
      JSON.stringify({
        score: 85,
        recommendation: "good",
        matchingSkills: ["React", "TypeScript"],
        missingOrWeakerSkills: ["AWS — not mentioned in resume"],
        experienceGaps: [],
        strengths: ["Clear React/TypeScript evidence"],
        summary: "Strong frontend match; cloud not evidenced.",
        scoringNotes: "Required skills high; preferred AWS low.",
      }),
    );

    const result = await generateJobMatch(baseInput);
    expect(result.score).toBe(85);
    // Score band wins over model recommendation drift
    expect(result.recommendation).toBe("strong");
    expect(result.matchingSkills).toContain("React");
  });

  it("rejects malformed JSON", async () => {
    vi.mocked(generateWithGemini).mockResolvedValue("not-json");
    await expect(generateJobMatch(baseInput)).rejects.toThrow(/invalid JSON/i);
  });

  it("rejects scores outside 0–100", async () => {
    vi.mocked(generateWithGemini).mockResolvedValue(
      JSON.stringify({
        score: 140,
        recommendation: "strong",
        matchingSkills: ["React"],
        missingOrWeakerSkills: [],
        experienceGaps: [],
        strengths: ["x"],
        summary: "y",
        scoringNotes: "z",
      }),
    );
    await expect(generateJobMatch(baseInput)).rejects.toThrow(/validate/i);
  });
});
