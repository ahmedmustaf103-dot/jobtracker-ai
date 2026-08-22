import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/server/services/applications.service", () => ({
  createApplication: vi.fn(),
  getApplicationStats: vi.fn(),
  getApplicationWithEvents: vi.fn(),
  listApplications: vi.fn(),
  updateApplication: vi.fn(),
  updateApplicationStatus: vi.fn(),
}));

vi.mock("@/lib/agent/remote-jobs", () => ({
  searchRemoteJobs: vi.fn(),
}));

vi.mock("@/lib/cover-letter/generate", () => ({
  generateCoverLetterText: vi.fn(),
}));

vi.mock("@/server/services/cover-letters.service", () => ({
  createCoverLetter: vi.fn(),
}));

import {
  getApplicationDetailsCapability,
  updateApplicationCapability,
  updateApplicationStatusCapability,
} from "@/lib/capabilities/handlers";
import {
  getApplicationWithEvents,
  updateApplication,
  updateApplicationStatus,
} from "@/server/services/applications.service";
import { EVAL_USER } from "./helpers";

describe("eval: ownership isolation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects details for unknown application ids", async () => {
    vi.mocked(getApplicationWithEvents).mockResolvedValue(null);
    const result = await getApplicationDetailsCapability(EVAL_USER, {
      applicationId: "someone_elses_app",
    });
    expect(result).toEqual({
      ok: false,
      error: "Application not found for this user.",
    });
    expect(getApplicationWithEvents).toHaveBeenCalledWith(
      EVAL_USER.userId,
      "someone_elses_app",
    );
  });

  it("rejects status updates for missing apps", async () => {
    vi.mocked(updateApplicationStatus).mockResolvedValue(null);
    const result = await updateApplicationStatusCapability(EVAL_USER, {
      applicationId: "missing",
      status: "APPLIED",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/not found/i);
    }
  });

  it("rejects full updates for missing apps", async () => {
    vi.mocked(getApplicationWithEvents).mockResolvedValue(null);
    const result = await updateApplicationCapability(EVAL_USER, {
      applicationId: "missing",
      notes: "should not write",
    });
    expect(result.ok).toBe(false);
    expect(updateApplication).not.toHaveBeenCalled();
  });
});
