import { describe, expect, it } from "vitest";

import {
  isCoverLetterTooShort,
  COVER_LETTER_SYSTEM_INSTRUCTION,
} from "@/lib/cover-letter/generate";

describe("isCoverLetterTooShort", () => {
  it("flags one- or two-sentence outputs", () => {
    expect(isCoverLetterTooShort("I am excited to apply for this role.")).toBe(
      true,
    );
  });

  it("accepts a multi-paragraph letter", () => {
    const letter = [
      "When I saw Northwind Labs hiring a Senior Frontend Engineer, I knew my experience building React and Next.js products would be a strong match for your team. I have spent the last several years turning complex requirements into polished interfaces that users rely on every day.",
      "Over the past several years I have shipped customer-facing dashboards, design systems, and performance improvements in fast-moving product teams. The posting emphasizes TypeScript, accessible UI, and collaboration with backend engineers — areas where I have delivered repeatedly, from prototyping through production release. I am comfortable owning features end to end, partnering with designers on interaction details, and writing maintainable code that scales as the product grows.",
      "Northwind's focus on developer experience and thoughtful product craft aligns with how I like to work. I am particularly drawn to your emphasis on measurable outcomes and cross-functional collaboration, and I would welcome the opportunity to contribute to a team that values both speed and quality.",
      "Thank you for considering my application. I would appreciate the chance to discuss how my frontend experience can support Northwind Labs' goals, and I look forward to hearing from you. Sincerely, Alex Morgan",
    ].join("\n\n");

    expect(isCoverLetterTooShort(letter)).toBe(false);
  });

  it("includes detailed system instructions", () => {
    expect(COVER_LETTER_SYSTEM_INSTRUCTION).toContain("four full paragraphs");
  });
});
