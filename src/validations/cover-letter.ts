import { z } from "zod";

export const generateCoverLetterSchema = z.object({
  company: z.string().min(1, "Company is required").max(120),
  role: z.string().min(1, "Role is required").max(120),
  jobDescription: z
    .string()
    .min(40, "Paste a longer job description for a better result")
    .max(8000, "Job description is too long"),
});

export type GenerateCoverLetterInput = z.infer<
  typeof generateCoverLetterSchema
>;

export const updateCoverLetterSchema = z.object({
  id: z.string().min(1),
  content: z.string().min(1, "Cover letter cannot be empty").max(12000),
});

export function parseGenerateCoverLetterForm(formData: FormData) {
  return generateCoverLetterSchema.safeParse({
    company: formData.get("company"),
    role: formData.get("role"),
    jobDescription: formData.get("jobDescription"),
  });
}
