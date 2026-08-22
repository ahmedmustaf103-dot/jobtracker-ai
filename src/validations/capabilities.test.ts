import { describe, expect, it } from "vitest";

import {
  getApplicationDetailsArgsSchema,
  updateApplicationArgsSchema,
} from "@/validations/capabilities";

describe("capability schemas", () => {
  it("requires applicationId for details", () => {
    expect(getApplicationDetailsArgsSchema.safeParse({}).success).toBe(false);
    expect(
      getApplicationDetailsArgsSchema.safeParse({
        applicationId: "app_1",
      }).success,
    ).toBe(true);
  });

  it("requires at least one update field", () => {
    const empty = updateApplicationArgsSchema.safeParse({
      applicationId: "app_1",
    });
    expect(empty.success).toBe(false);

    const withStatus = updateApplicationArgsSchema.safeParse({
      applicationId: "app_1",
      status: "APPLIED",
    });
    expect(withStatus.success).toBe(true);
  });

  it("rejects invalid update URLs", () => {
    const parsed = updateApplicationArgsSchema.safeParse({
      applicationId: "app_1",
      url: "not-a-url",
    });
    expect(parsed.success).toBe(false);
  });
});
