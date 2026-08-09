import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/agent/remote-jobs", () => ({
  searchRemoteJobs: vi.fn(),
}));

vi.mock("@/server/services/applications.service", () => ({
  createApplication: vi.fn(),
  getApplicationStats: vi.fn(),
  listApplications: vi.fn(),
  updateApplicationStatus: vi.fn(),
}));

import { searchRemoteJobs } from "@/lib/agent/remote-jobs";
import { executeAgentTool } from "@/lib/agent/tools";
import {
  createApplication,
  getApplicationStats,
  listApplications,
  updateApplicationStatus,
} from "@/server/services/applications.service";

const ctx = { userId: "user_1", candidateName: "Alex" };

describe("executeAgentTool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("searches remote jobs", async () => {
    vi.mocked(searchRemoteJobs).mockResolvedValue({
      source: "jobicy",
      jobs: [
        {
          id: 1,
          title: "Frontend Engineer",
          company: "Remote Co",
          location: "Worldwide",
          url: "https://example.com/jobs/1",
          salary: null,
          category: "Software Development",
          tags: ["react"],
          publicationDate: null,
        },
      ],
    });

    const result = await executeAgentTool(
      "search_remote_jobs",
      { query: "react", limit: 3 },
      ctx,
    );

    expect(searchRemoteJobs).toHaveBeenCalledWith("react", 3);
    expect(result.result).toMatchObject({ count: 1, source: "jobicy" });
  });

  it("returns pipeline stats", async () => {
    vi.mocked(getApplicationStats).mockResolvedValue({
      total: 2,
      byStatus: {
        WISHLIST: 1,
        APPLIED: 1,
        SCREENING: 0,
        INTERVIEW: 0,
        OFFER: 0,
        REJECTED: 0,
        WITHDRAWN: 0,
      },
      recent: [
        {
          id: "app_1",
          userId: "user_1",
          company: "Acme",
          title: "Engineer",
          location: null,
          url: null,
          status: "WISHLIST",
          salary: null,
          notes: null,
          appliedAt: null,
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-02"),
        },
      ],
    });

    const result = await executeAgentTool("get_pipeline_stats", {}, ctx);
    expect(result.result).toMatchObject({
      total: 2,
      byStatus: { WISHLIST: 1, APPLIED: 1 },
    });
  });

  it("filters applications by query", async () => {
    vi.mocked(listApplications).mockResolvedValue([
      {
        id: "app_1",
        userId: "user_1",
        company: "Stripe",
        title: "Frontend",
        location: "Remote",
        url: null,
        status: "APPLIED",
        salary: null,
        notes: null,
        appliedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "app_2",
        userId: "user_1",
        company: "Acme",
        title: "Backend",
        location: null,
        url: null,
        status: "WISHLIST",
        salary: null,
        notes: null,
        appliedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await executeAgentTool(
      "search_applications",
      { query: "stripe" },
      ctx,
    );

    expect(result.result).toMatchObject({ count: 1 });
    expect(
      (result.result as { applications: { company: string }[] }).applications[0]
        .company,
    ).toBe("Stripe");
  });

  it("saves applications", async () => {
    vi.mocked(createApplication).mockResolvedValue({
      id: "app_new",
      userId: "user_1",
      company: "Notion",
      title: "Engineer",
      location: "Remote",
      url: "https://example.com/jobs/notion",
      status: "WISHLIST",
      salary: null,
      notes: null,
      appliedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await executeAgentTool(
      "save_application",
      {
        company: "Notion",
        title: "Engineer",
        location: "Remote",
        url: "https://example.com/jobs/notion",
      },
      ctx,
    );

    expect(createApplication).toHaveBeenCalled();
    expect(result.result).toMatchObject({
      saved: true,
      application: { id: "app_new", company: "Notion" },
    });
  });

  it("updates application status", async () => {
    vi.mocked(updateApplicationStatus).mockResolvedValue({
      id: "app_1",
      userId: "user_1",
      company: "Acme",
      title: "Engineer",
      location: null,
      url: null,
      status: "APPLIED",
      salary: null,
      notes: null,
      appliedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await executeAgentTool(
      "update_application_status",
      { applicationId: "app_1", status: "APPLIED" },
      ctx,
    );

    expect(updateApplicationStatus).toHaveBeenCalledWith(
      "user_1",
      "app_1",
      "APPLIED",
    );
    expect(result.result).toMatchObject({ updated: true });
  });

  it("rejects unknown tools", async () => {
    const result = await executeAgentTool("not_a_tool", {}, ctx);
    expect(result.result).toEqual({ error: "Unknown tool: not_a_tool" });
  });
});
