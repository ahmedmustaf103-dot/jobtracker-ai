import { describe, expect, it } from "vitest";

import { resolveJobDescription } from "@/lib/job-match/resolve-jd";
import {
  jobMatchResultSchema,
  recommendationFromScore,
  recommendationLabel,
} from "@/validations/job-match";

describe("jobMatchResultSchema", () => {
  const valid = {
    score: 82,
    recommendation: "strong",
    matchingSkills: ["React", "TypeScript"],
    missingOrWeakerSkills: ["AWS — not mentioned in resume"],
    experienceGaps: [],
    strengths: ["Strong frontend overlap with the posting."],
    summary: "Strong technical match with a cloud gap.",
    scoringNotes: "Required skills scored high; preferred cloud skills lower.",
  };

  it("accepts a strong match payload", () => {
    expect(jobMatchResultSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects scores outside 0–100", () => {
    expect(
      jobMatchResultSchema.safeParse({ ...valid, score: 150 }).success,
    ).toBe(false);
    expect(
      jobMatchResultSchema.safeParse({ ...valid, score: -1 }).success,
    ).toBe(false);
  });

  it("rejects malformed recommendation values", () => {
    expect(
      jobMatchResultSchema.safeParse({
        ...valid,
        recommendation: "excellent",
      }).success,
    ).toBe(false);
  });
});

describe("recommendationFromScore", () => {
  it("maps bands", () => {
    expect(recommendationFromScore(90)).toBe("strong");
    expect(recommendationFromScore(70)).toBe("good");
    expect(recommendationFromScore(50)).toBe("partial");
    expect(recommendationFromScore(20)).toBe("weak");
  });

  it("labels recommendations", () => {
    expect(recommendationLabel("strong")).toBe("Strong match");
  });
});

describe("resolveJobDescription", () => {
  it("prefers paste over notes and cover letter", () => {
    const resolved = resolveJobDescription({
      pasted: "A".repeat(40),
      notes: "B".repeat(40),
      coverLetterJobDescription: "C".repeat(40),
    });
    expect(resolved).toEqual({ text: "A".repeat(40), source: "paste" });
  });

  it("falls back to notes then cover letter", () => {
    expect(
      resolveJobDescription({ notes: "N".repeat(40) })?.source,
    ).toBe("notes");
    expect(
      resolveJobDescription({
        coverLetterJobDescription: "C".repeat(40),
      })?.source,
    ).toBe("cover_letter");
  });

  it("returns null when nothing is long enough", () => {
    expect(resolveJobDescription({ pasted: "short", notes: "x" })).toBeNull();
  });
});
