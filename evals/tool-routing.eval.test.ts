import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/agent/remote-jobs", () => ({
  searchRemoteJobs: vi.fn(),
}));

vi.mock("@/server/services/applications.service", () => ({
  createApplication: vi.fn(),
  getApplicationStats: vi.fn(),
  getApplicationWithEvents: vi.fn(),
  listApplications: vi.fn(),
  updateApplication: vi.fn(),
  updateApplicationStatus: vi.fn(),
}));

vi.mock("@/lib/cover-letter/generate", () => ({
  generateCoverLetterText: vi.fn(),
}));

vi.mock("@/server/services/cover-letters.service", () => ({
  createCoverLetter: vi.fn(),
}));

import { executeAgentTool } from "@/lib/agent/tools";
import { getApplicationStats } from "@/server/services/applications.service";

describe("eval: tool routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const ctx = {
    userId: "eval_user_1",
    candidateName: "Eval Candidate",
  };

  it("routes get_pipeline_stats to stats capability", async () => {
    vi.mocked(getApplicationStats).mockResolvedValue({
      total: 1,
      byStatus: {
        WISHLIST: 1,
        APPLIED: 0,
        SCREENING: 0,
        INTERVIEW: 0,
        OFFER: 0,
        REJECTED: 0,
        WITHDRAWN: 0,
      },
      recent: [],
    });

    const trace = await executeAgentTool("get_pipeline_stats", {}, ctx);
    expect(trace.name).toBe("get_pipeline_stats");
    expect(trace.result).toMatchObject({ total: 1 });
  });

  it("returns a clear error for unknown tools", async () => {
    const trace = await executeAgentTool("delete_everything", {}, ctx);
    expect(trace.result).toEqual({
      error: "Unknown tool: delete_everything",
    });
  });
});
