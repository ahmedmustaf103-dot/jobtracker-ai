import { describe, expect, it } from "vitest";

import { scoreRemoteJob } from "@/lib/agent/remote-jobs";

describe("scoreRemoteJob", () => {
  it("ranks title matches above weak excerpt noise", () => {
    const reactRole = scoreRemoteJob(
      {
        title: "Senior React Developer",
        company: "Acme",
        category: "Software Engineering",
        tags: ["react", "typescript"],
        excerpt: "Build UI with React and TypeScript",
      },
      ["react"],
    );

    const unrelated = scoreRemoteJob(
      {
        title: "Sales Jedi",
        company: "Creative Force",
        category: "Sales",
        tags: ["saas", "sales"],
        excerpt: "Help customers react quickly to opportunities",
      },
      ["react"],
    );

    expect(reactRole).toBeGreaterThan(unrelated);
    expect(reactRole).toBeGreaterThan(0);
  });

  it("gives zero when tokens are absent", () => {
    const score = scoreRemoteJob(
      {
        title: "Tier III Service Desk Engineer",
        company: "Unio Digital",
        category: "Support",
        tags: ["azure", "cisco"],
        excerpt: "Handle tickets and hardware issues",
      },
      ["react"],
    );

    expect(score).toBe(0);
  });
});
