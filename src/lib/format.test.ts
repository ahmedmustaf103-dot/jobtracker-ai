import { describe, expect, it } from "vitest";

import { formatCountLabel, pluralize } from "@/lib/format";

describe("pluralize", () => {
  it("uses singular for count of 1", () => {
    expect(pluralize(1, "application")).toBe("application");
  });

  it("uses plural otherwise", () => {
    expect(pluralize(3, "application")).toBe("applications");
  });
});

describe("formatCountLabel", () => {
  it("formats count with noun", () => {
    expect(formatCountLabel(1, "application")).toBe("1 application");
    expect(formatCountLabel(4, "application")).toBe("4 applications");
  });
});
