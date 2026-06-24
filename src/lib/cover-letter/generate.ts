import { getCoverLetterModel } from "@/lib/gemini";

export type CoverLetterGenerationInput = {
  company: string;
  role: string;
  jobDescription: string;
  candidateName: string;
};

function buildPrompt(input: CoverLetterGenerationInput) {
  return [
    `Write a tailored, compelling cover letter for the following application.`,
    ``,
    `Candidate name: ${input.candidateName}`,
    `Company: ${input.company}`,
    `Role: ${input.role}`,
    ``,
    `Job description:`,
    `"""`,
    input.jobDescription,
    `"""`,
    ``,
    `Guidelines:`,
    `- Keep it concise (3-4 short paragraphs, under 350 words).`,
    `- Open with a strong, specific hook — avoid generic phrases like "I am writing to apply".`,
    `- Connect the candidate's likely strengths to the role's key requirements.`,
    `- Use a confident, professional, and warm tone.`,
    `- Do not invent specific facts, employers, or metrics about the candidate.`,
    `- End with a polite call to action and sign off with the candidate's name.`,
    `- Return only the cover letter text, with no preamble or markdown.`,
  ].join("\n");
}

export async function generateCoverLetterText(
  input: CoverLetterGenerationInput,
): Promise<string> {
  const model = getCoverLetterModel();
  const result = await model.generateContent(buildPrompt(input));
  const content = result.response.text().trim();

  if (!content) {
    throw new Error("The AI returned an empty response.");
  }

  return content;
}
