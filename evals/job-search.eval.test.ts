import { beforeEach, describe, expect, it, vi } from "vitest";

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

import { searchRemoteJobs } from "@/lib/agent/remote-jobs";
import { searchJobsCapability } from "@/lib/capabilities/handlers";

describe("eval: job search capability", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a helpful note when no jobs match", async () => {
    vi.mocked(searchRemoteJobs).mockResolvedValue({
      source: "jobicy",
      jobs: [],
    });

    const result = await searchJobsCapability({ query: "react", limit: 3 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.count).toBe(0);
      expect(result.data.note).toMatch(/No relevant remote roles/i);
    }
  });

  it("surfaces sanitized operational errors", async () => {
    vi.mocked(searchRemoteJobs).mockRejectedValue(
      new Error("Jobicy request failed (503)."),
    );

    const result = await searchJobsCapability({ query: "react" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Jobicy request failed (503).");
    }
  });

  it("does not leak secrets from job board failures", async () => {
    vi.mocked(searchRemoteJobs).mockRejectedValue(
      new Error("upstream failed api key sk-secret-123"),
    );

    const result = await searchJobsCapability({ query: "react" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Could not search remote jobs right now.");
      expect(result.error).not.toMatch(/sk-secret/);
    }
  });
});
