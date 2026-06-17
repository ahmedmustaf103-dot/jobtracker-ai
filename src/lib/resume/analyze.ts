import { getOpenAI, OPENAI_MODEL } from "@/lib/openai";
import type { ResumeAnalysisPayload } from "@/types/resume";
import { resumeAnalysisSchema } from "@/validations/resume";

function buildAnalysisPrompt(resumeText: string, candidateName: string) {
  return [
    `Analyze the following resume for ${candidateName}.`,
    `Return a JSON object with this exact shape:`,
    `{`,
    `  "score": number (0-100 overall quality),`,
    `  "strengths": string[] (3-5 specific strengths),`,
    `  "weaknesses": string[] (3-5 specific weaknesses),`,
    `  "missingSkills": string[] (skills commonly expected but absent),`,
    `  "atsSuggestions": string[] (3-5 ATS optimization tips),`,
    `  "improvements": string[] (3-5 actionable improvements),`,
    `  "keywords": {`,
    `    "present": string[] (strong keywords found),`,
    `    "missing": string[] (important keywords missing),`,
    `    "recommended": string[] (keywords to add)`,
    `  }`,
    `}`,
    ``,
    `Be specific, constructive, and professional. Base everything only on the resume text.`,
    ``,
    `Resume:`,
    `"""`,
    resumeText.slice(0, 12000),
    `"""`,
  ].join("\n");
}

export async function analyzeResumeText(
  resumeText: string,
  candidateName: string,
): Promise<ResumeAnalysisPayload> {
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are an expert resume coach and ATS specialist. Respond with valid JSON only.",
      },
      {
        role: "user",
        content: buildAnalysisPrompt(resumeText, candidateName),
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("The AI returned an empty analysis. Please try again.");
  }

  const parsed = resumeAnalysisSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    throw new Error("Failed to parse the AI analysis. Please try again.");
  }

  return parsed.data;
}
