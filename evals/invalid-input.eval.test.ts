import { describe, expect, it, vi } from "vitest";

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

import {
  generateCoverLetterCapability,
  saveApplicationCapability,
  searchJobsCapability,
  updateApplicationCapability,
} from "@/lib/capabilities/handlers";
import { EVAL_USER } from "./helpers";

describe("eval: invalid input", () => {
  it("rejects empty job search queries", async () => {
    const result = await searchJobsCapability({ query: "  " });
    expect(result.ok).toBe(false);
  });

  it("rejects save_application without company/title", async () => {
    const result = await saveApplicationCapability(EVAL_USER, {
      company: "",
      title: "Engineer",
    });
    expect(result.ok).toBe(false);
  });

  it("rejects update_application with no fields", async () => {
    const result = await updateApplicationCapability(EVAL_USER, {
      applicationId: "app_1",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/at least one field/i);
    }
  });

  it("rejects cover letters with short job descriptions", async () => {
    const result = await generateCoverLetterCapability(EVAL_USER, {
      company: "Acme",
      role: "Engineer",
      jobDescription: "too short",
    });
    expect(result.ok).toBe(false);
  });

  it("rejects invalid application URLs on save", async () => {
    const result = await saveApplicationCapability(EVAL_USER, {
      company: "Acme",
      title: "Engineer",
      url: "notaurl",
    });
    expect(result.ok).toBe(false);
  });
});
