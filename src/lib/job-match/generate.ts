import { generateWithGemini } from "@/lib/gemini-generate";
import {
  JOB_MATCH_WEIGHTS,
  jobMatchResultSchema,
  recommendationFromScore,
  type JobMatchResult,
} from "@/validations/job-match";

export const JOB_MATCH_SYSTEM_INSTRUCTION = `You are an expert technical recruiter scoring how well a candidate resume matches a job description.
You MUST respond with valid JSON only — no markdown fences, no commentary.
Never invent skills, employers, degrees, years of experience, or projects that are not clearly evidenced in the resume text.
If something is absent from the resume, describe it as "not mentioned in resume" — do NOT claim the candidate lacks the skill with certainty.
Prioritize required/core technical qualifications over nice-to-haves.
Use this approximate weighting when choosing score:
- Required/core skills: ${JOB_MATCH_WEIGHTS.requiredSkills}%
- Preferred skills: ${JOB_MATCH_WEIGHTS.preferredSkills}%
- Experience alignment: ${JOB_MATCH_WEIGHTS.experience}%
- Role/responsibility fit: ${JOB_MATCH_WEIGHTS.roleAlignment}%
recommendation must be: strong (80-100), good (65-79), partial (45-64), or weak (0-44).`;

export type JobMatchGenerateInput = {
  company: string;
  role: string;
  jobDescription: string;
  resumeText: string;
  candidateName: string;
};

function stripJsonFences(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced?.[1]?.trim() ?? trimmed;
}

function buildPrompt(input: JobMatchGenerateInput) {
  return [
    `Score how well this resume matches the job.`,
    `Candidate name: ${input.candidateName}`,
    `Company: ${input.company}`,
    `Role: ${input.role}`,
    ``,
    `Return JSON with this exact shape:`,
    `{`,
    `  "score": number (0-100 integer),`,
    `  "recommendation": "strong" | "good" | "partial" | "weak",`,
    `  "matchingSkills": string[] (skills clearly evidenced in the resume that the job needs),`,
    `  "missingOrWeakerSkills": string[] (important job requirements not mentioned or only weakly evidenced — phrase as "not mentioned in resume" / "limited evidence of …"),`,
    `  "experienceGaps": string[] (experience/seniority gaps based only on resume evidence),`,
    `  "strengths": string[] (2-5 short reasons the candidate is a fit),`,
    `  "summary": string (1-3 sentence AI recommendation),`,
    `  "scoringNotes": string (brief explanation of how the weighted factors led to this score)`,
    `}`,
    ``,
    `Job description:`,
    `"""`,
    input.jobDescription.slice(0, 10000),
    `"""`,
    ``,
    `Resume:`,
    `"""`,
    input.resumeText.slice(0, 12000),
    `"""`,
  ].join("\n");
}

export async function generateJobMatch(
  input: JobMatchGenerateInput,
): Promise<JobMatchResult> {
  const raw = await generateWithGemini(buildPrompt(input), {
    systemInstruction: JOB_MATCH_SYSTEM_INSTRUCTION,
    temperature: 0.25,
    maxOutputTokens: 2048,
    responseMimeType: "application/json",
  });

  let json: unknown;
  try {
    json = JSON.parse(stripJsonFences(raw));
  } catch {
    throw new Error("The AI returned invalid JSON for the job match.");
  }

  const parsed = jobMatchResultSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Failed to validate the AI job match result.");
  }

  // Keep recommendation consistent with score bands when the model drifts.
  const recommendation = recommendationFromScore(parsed.data.score);
  return {
    ...parsed.data,
    recommendation,
  };
}
