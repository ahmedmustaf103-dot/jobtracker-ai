import { describe, expect, it } from "vitest";

import {
  agentChatRequestSchema,
  saveApplicationArgsSchema,
  searchRemoteJobsArgsSchema,
  updateApplicationStatusArgsSchema,
} from "@/validations/agent";

describe("agentChatRequestSchema", () => {
  it("accepts a short conversation ending with a user message", () => {
    const parsed = agentChatRequestSchema.safeParse({
      messages: [
        { role: "user", content: "Find React jobs" },
        { role: "assistant", content: "Here are a few roles." },
        { role: "user", content: "Save the first one" },
      ],
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects empty messages", () => {
    const parsed = agentChatRequestSchema.safeParse({
      messages: [{ role: "user", content: "   " }],
    });

    expect(parsed.success).toBe(false);
  });
});

describe("tool arg schemas", () => {
  it("defaults remote job search limit", () => {
    const parsed = searchRemoteJobsArgsSchema.safeParse({ query: "React" });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.limit).toBe(5);
    }
  });

  it("defaults save_application status to WISHLIST", () => {
    const parsed = saveApplicationArgsSchema.safeParse({
      company: "Acme",
      title: "Engineer",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.status).toBe("WISHLIST");
    }
  });

  it("requires applicationId for status updates", () => {
    const parsed = updateApplicationStatusArgsSchema.safeParse({
      status: "APPLIED",
    });
    expect(parsed.success).toBe(false);
  });
});
