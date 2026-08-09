import { z } from "zod";

import { applicationStatusSchema } from "@/validations/application";

const optionalTrimmed = z
  .string()
  .nullish()
  .transform((v) => {
    if (v == null) return undefined;
    const trimmed = v.trim();
    return trimmed === "" ? undefined : trimmed;
  });

export const agentMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(4000, "Message is too long"),
});

export const agentChatRequestSchema = z.object({
  messages: z
    .array(agentMessageSchema)
    .min(1, "At least one message is required")
    .max(20, "Too many messages"),
});

export const searchRemoteJobsArgsSchema = z.object({
  query: z.string().trim().min(1).max(120),
  limit: z.number().int().min(1).max(10).nullish().transform((v) => v ?? 5),
});

export const searchApplicationsArgsSchema = z.object({
  query: optionalTrimmed.pipe(z.string().max(120).optional()),
  status: applicationStatusSchema.nullish().transform((v) => v ?? undefined),
  limit: z.number().int().min(1).max(20).nullish().transform((v) => v ?? 10),
});

export const saveApplicationArgsSchema = z.object({
  company: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(120),
  location: optionalTrimmed.pipe(z.string().max(120).optional()),
  url: optionalTrimmed.pipe(z.string().url().max(500).optional()),
  salary: optionalTrimmed.pipe(z.string().max(80).optional()),
  notes: optionalTrimmed.pipe(z.string().max(2000).optional()),
  status: applicationStatusSchema
    .nullish()
    .transform((v) => v ?? "WISHLIST"),
});

export const updateApplicationStatusArgsSchema = z.object({
  applicationId: z.string().trim().min(1).max(64),
  status: applicationStatusSchema,
});

export type AgentChatRequest = z.infer<typeof agentChatRequestSchema>;
