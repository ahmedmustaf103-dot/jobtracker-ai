import { describe, expect, it } from "vitest";

import { scoreRemoteJob } from "@/lib/agent/remote-jobs";

describe("eval: job search relevance scoring", () => {
  it("prefers title matches over weak excerpt noise", () => {
    const reactRole = scoreRemoteJob(
      {
        title: "Senior React Developer",
        company: "Acme",
        category: "Engineering",
        tags: ["react"],
        excerpt: "Build UI with React",
      },
      ["react"],
    );
    const noise = scoreRemoteJob(
      {
        title: "Sales Jedi",
        company: "Other",
        category: "Sales",
        tags: ["saas"],
        excerpt: "Help customers react quickly",
      },
      ["react"],
    );

    expect(reactRole).toBeGreaterThan(noise);
    expect(reactRole).toBeGreaterThan(0);
  });

  it("scores zero when tokens are absent", () => {
    expect(
      scoreRemoteJob(
        {
          title: "Service Desk Engineer",
          company: "Unio",
          category: "Support",
          tags: ["azure"],
          excerpt: "Handle tickets",
        },
        ["react"],
      ),
    ).toBe(0);
  });
});
