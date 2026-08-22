import { describe, expect, it } from "vitest";

import {
  capabilityUnknownError,
  sanitizeCapabilityError,
} from "@/lib/capabilities/errors";

describe("sanitizeCapabilityError", () => {
  it("keeps short operational messages", () => {
    expect(
      sanitizeCapabilityError(
        new Error("Jobicy request failed (503)."),
        "fallback",
      ),
    ).toBe("Jobicy request failed (503).");
  });

  it("hides secrets and connection strings", () => {
    expect(
      sanitizeCapabilityError(
        new Error("Failed with DATABASE_URL=postgresql://user:pass@host/db"),
        "fallback",
      ),
    ).toBe("fallback");

    expect(
      sanitizeCapabilityError(
        new Error("Invalid API key sk-secret-value"),
        "fallback",
      ),
    ).toBe("fallback");
  });

  it("maps prisma-looking errors", () => {
    expect(
      sanitizeCapabilityError(
        new Error("Unique constraint failed on the fields: (`email`)"),
        "fallback",
      ),
    ).toMatch(/database update/i);
  });

  it("capabilityUnknownError wraps sanitize", () => {
    expect(
      capabilityUnknownError(new Error("password leaked"), "safe"),
    ).toEqual({ ok: false, error: "safe" });
  });
});
