import { z } from "zod";

export const applicationStatusSchema = z.enum([
  "WISHLIST",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
]);

export const applicationFormSchema = z.object({
  company: z.string().min(1, "Company is required").max(120),
  title: z.string().min(1, "Job title is required").max(120),
  location: z.string().max(120).optional(),
  url: z
    .string()
    .max(500)
    .optional()
    .transform((v) => (v === "" ? undefined : v))
    .pipe(z.string().url("Enter a valid URL").optional()),
  status: applicationStatusSchema.default("WISHLIST"),
  salary: z.string().max(80).optional(),
  notes: z.string().max(5000).optional(),
});

export type ApplicationFormInput = z.infer<typeof applicationFormSchema>;

function formDataToObject(formData: FormData) {
  return {
    company: formData.get("company"),
    title: formData.get("title"),
    location: formData.get("location") || undefined,
    url: formData.get("url") || undefined,
    status: formData.get("status"),
    salary: formData.get("salary") || undefined,
    notes: formData.get("notes") || undefined,
  };
}

export function parseApplicationFormData(formData: FormData) {
  return applicationFormSchema.safeParse(formDataToObject(formData));
}
