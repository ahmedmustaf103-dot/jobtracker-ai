import { z } from "zod";

export const jobMatchRecommendationSchema = z.enum([
  "strong",
  "good",
  "partial",
  "weak",
]);

export const jobMatchResultSchema = z.object({
  score: z.number().int().min(0).max(100),
  recommendation: jobMatchRecommendationSchema,
  matchingSkills: z.array(z.string().trim().min(1).max(80)).max(20),
  missingOrWeakerSkills: z.array(z.string().trim().min(1).max(120)).max(20),
  experienceGaps: z.array(z.string().trim().min(1).max(240)).max(10),
  strengths: z.array(z.string().trim().min(1).max(240)).max(10),
  summary: z.string().trim().min(1).max(600),
  scoringNotes: z.string().trim().min(1).max(800),
});

export const analyzeJobMatchArgsSchema = z.object({
  applicationId: z.string().trim().min(1).max(64),
  jobDescription: z
    .string()
    .trim()
    .min(40, "Paste a longer job description for a better match")
    .max(12000, "Job description is too long")
    .optional(),
});

export type JobMatchResult = z.infer<typeof jobMatchResultSchema>;
export type JobMatchRecommendation = z.infer<
  typeof jobMatchRecommendationSchema
>;

export const JOB_MATCH_WEIGHTS = {
  requiredSkills: 45,
  preferredSkills: 20,
  experience: 20,
  roleAlignment: 15,
} as const;

export function recommendationFromScore(score: number): JobMatchRecommendation {
  if (score >= 80) return "strong";
  if (score >= 65) return "good";
  if (score >= 45) return "partial";
  return "weak";
}

export function recommendationLabel(value: JobMatchRecommendation): string {
  switch (value) {
    case "strong":
      return "Strong match";
    case "good":
      return "Good match";
    case "partial":
      return "Partial match";
    case "weak":
      return "Weak match";
  }
}
