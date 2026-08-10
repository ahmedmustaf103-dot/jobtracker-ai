import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/agent/remote-jobs", () => ({
  searchRemoteJobs: vi.fn(),
}));

vi.mock("@/lib/cover-letter/generate", () => ({
  generateCoverLetterText: vi.fn(),
}));

vi.mock("@/server/services/applications.service", () => ({
  createApplication: vi.fn(),
  getApplicationStats: vi.fn(),
  getApplicationWithEvents: vi.fn(),
  listApplications: vi.fn(),
  updateApplication: vi.fn(),
  updateApplicationStatus: vi.fn(),
}));

vi.mock("@/server/services/cover-letters.service", () => ({
  createCoverLetter: vi.fn(),
}));

import { searchRemoteJobs } from "@/lib/agent/remote-jobs";
import {
  getApplicationDetailsCapability,
  getApplicationsCapability,
  searchJobsCapability,
  updateApplicationCapability,
} from "@/lib/capabilities/handlers";
import { generateCoverLetterText } from "@/lib/cover-letter/generate";
import {
  getApplicationWithEvents,
  listApplications,
  updateApplication,
} from "@/server/services/applications.service";
import { createCoverLetter } from "@/server/services/cover-letters.service";

const user = {
  userId: "user_1",
  candidateName: "Alex",
  email: "alex@example.com",
};

describe("capability handlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("searchJobsCapability returns ranked jobs", async () => {
    vi.mocked(searchRemoteJobs).mockResolvedValue({
      source: "jobicy",
      jobs: [
        {
          id: 1,
          title: "React Engineer",
          company: "Acme",
          location: "Remote",
          url: "https://example.com/1",
          salary: null,
          category: "Engineering",
          tags: ["react"],
          publicationDate: null,
        },
      ],
    });

    const result = await searchJobsCapability({ query: "react", limit: 3 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.count).toBe(1);
      expect(result.data.source).toBe("jobicy");
    }
  });

  it("rejects invalid search input", async () => {
    const result = await searchJobsCapability({ query: "" });
    expect(result.ok).toBe(false);
  });

  it("getApplicationDetailsCapability enforces ownership miss", async () => {
    vi.mocked(getApplicationWithEvents).mockResolvedValue(null);
    const result = await getApplicationDetailsCapability(user, {
      applicationId: "missing",
    });
    expect(result).toEqual({
      ok: false,
      error: "Application not found for this user.",
    });
  });

  it("getApplicationsCapability filters by query", async () => {
    vi.mocked(listApplications).mockResolvedValue([
      {
        id: "a1",
        userId: "user_1",
        company: "Stripe",
        title: "Frontend",
        location: null,
        url: null,
        status: "APPLIED",
        salary: null,
        notes: null,
        appliedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await getApplicationsCapability(user, { query: "stripe" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.count).toBe(1);
    }
  });

  it("updateApplicationCapability merges fields and checks ownership", async () => {
    vi.mocked(getApplicationWithEvents).mockResolvedValue({
      id: "app_1",
      userId: "user_1",
      company: "Acme",
      title: "Engineer",
      location: "Remote",
      url: null,
      status: "WISHLIST",
      salary: null,
      notes: null,
      appliedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      events: [],
    });
    vi.mocked(updateApplication).mockResolvedValue({
      id: "app_1",
      userId: "user_1",
      company: "Acme",
      title: "Engineer",
      location: "Remote",
      url: null,
      status: "APPLIED",
      salary: null,
      notes: null,
      appliedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await updateApplicationCapability(user, {
      applicationId: "app_1",
      status: "APPLIED",
    });

    expect(updateApplication).toHaveBeenCalledWith(
      "user_1",
      "app_1",
      expect.objectContaining({ status: "APPLIED", company: "Acme" }),
    );
    expect(result.ok).toBe(true);
  });

  it("generateCoverLetterCapability requires enough job description", async () => {
    const { generateCoverLetterCapability } = await import(
      "@/lib/capabilities/handlers"
    );
    const result = await generateCoverLetterCapability(user, {
      company: "Acme",
      role: "Engineer",
      jobDescription: "too short",
    });
    expect(result.ok).toBe(false);
    expect(generateCoverLetterText).not.toHaveBeenCalled();
    expect(createCoverLetter).not.toHaveBeenCalled();
  });
});
