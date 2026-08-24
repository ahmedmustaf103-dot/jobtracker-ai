import { z } from "zod";

import {
  applicationStatusSchema,
  applicationFormSchema,
} from "@/validations/application";
import {
  saveApplicationArgsSchema,
  searchApplicationsArgsSchema,
  searchRemoteJobsArgsSchema,
  updateApplicationStatusArgsSchema,
} from "@/validations/agent";
import { generateCoverLetterSchema } from "@/validations/cover-letter";

const optionalTrimmed = z
  .string()
  .nullish()
  .transform((v) => {
    if (v == null) return undefined;
    const trimmed = v.trim();
    return trimmed === "" ? undefined : trimmed;
  });

export const getApplicationDetailsArgsSchema = z.object({
  applicationId: z.string().trim().min(1).max(64),
});

export const updateApplicationArgsSchema = z
  .object({
    applicationId: z.string().trim().min(1).max(64),
    company: optionalTrimmed.pipe(z.string().min(1).max(120).optional()),
    title: optionalTrimmed.pipe(z.string().min(1).max(120).optional()),
    location: optionalTrimmed.pipe(z.string().max(120).optional()),
    url: optionalTrimmed.pipe(z.string().url().max(500).optional()),
    salary: optionalTrimmed.pipe(z.string().max(80).optional()),
    notes: optionalTrimmed.pipe(z.string().max(5000).optional()),
    status: applicationStatusSchema.optional(),
  })
  .superRefine((value, ctx) => {
    const updatableKeys = [
      "company",
      "title",
      "location",
      "url",
      "salary",
      "notes",
      "status",
    ] as const;
    const hasUpdate = updatableKeys.some((key) => value[key] !== undefined);
    if (!hasUpdate) {
      ctx.addIssue({
        code: "custom",
        message:
          "Provide at least one field to update (company, title, location, url, salary, notes, or status).",
      });
    }
  });

export {
  searchRemoteJobsArgsSchema as searchJobsArgsSchema,
  searchApplicationsArgsSchema as getApplicationsArgsSchema,
  saveApplicationArgsSchema,
  updateApplicationStatusArgsSchema,
  generateCoverLetterSchema as generateCoverLetterArgsSchema,
  applicationFormSchema,
};

export type UpdateApplicationArgs = z.infer<typeof updateApplicationArgsSchema>;
