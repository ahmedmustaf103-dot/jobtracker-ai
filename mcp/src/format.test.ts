import { describe, expect, it } from "vitest";

import {
  fromCapabilityResult,
  toolError,
  toolSuccess,
} from "../src/format";

describe("MCP format helpers", () => {
  it("serializes success payloads as JSON text", () => {
    const result = toolSuccess({ count: 1 });
    expect(result.content[0]?.text).toContain('"count": 1');
    expect(result).not.toHaveProperty("isError");
  });

  it("marks errors clearly", () => {
    const result = toolError("Application not found for this user.");
    expect(result.isError).toBe(true);
    expect(JSON.parse(result.content[0]!.text)).toEqual({
      error: "Application not found for this user.",
    });
  });

  it("maps CapabilityResult failures to tool errors", () => {
    const result = fromCapabilityResult({
      ok: false,
      error: "Invalid search arguments",
    });
    expect(result.isError).toBe(true);
  });

  it("maps CapabilityResult success to tool success", () => {
    const result = fromCapabilityResult({
      ok: true,
      data: { total: 3 },
    });
    expect(result.isError).toBeUndefined();
    expect(result.content[0]?.text).toContain('"total": 3');
  });
});
