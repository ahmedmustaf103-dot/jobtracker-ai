import { expect } from "vitest";

import type { CapabilityResult } from "@/lib/capabilities/types";

export const EVAL_USER = {
  userId: "eval_user_1",
  candidateName: "Eval Candidate",
  email: "eval@jobtracker.ai",
} as const;

export function expectOk<T>(result: CapabilityResult<T>): T {
  if (!result.ok) {
    throw new Error(`Expected ok result, got error: ${result.error}`);
  }
  return result.data;
}

export function expectErr(
  result: CapabilityResult<unknown>,
  match?: RegExp | string,
) {
  if (result.ok) {
    throw new Error("Expected error result, got ok");
  }
  if (typeof match === "string") {
    expect(result.error).toContain(match);
  } else if (match) {
    expect(result.error).toMatch(match);
  }
  return result.error;
}
