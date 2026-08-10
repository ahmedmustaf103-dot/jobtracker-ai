import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db";
import { McpAuthError, resolveMcpUser } from "@/lib/capabilities/auth-context";

describe("resolveMcpUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.MCP_USER_ID;
    delete process.env.MCP_USER_EMAIL;
  });

  it("rejects when neither MCP_USER_ID nor MCP_USER_EMAIL is set", async () => {
    await expect(resolveMcpUser()).rejects.toBeInstanceOf(McpAuthError);
  });

  it("resolves by email", async () => {
    process.env.MCP_USER_EMAIL = "demo@jobtracker.ai";
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user_demo",
      name: "Demo",
      email: "demo@jobtracker.ai",
    } as never);

    const user = await resolveMcpUser();
    expect(user).toEqual({
      userId: "user_demo",
      email: "demo@jobtracker.ai",
      candidateName: "Demo",
    });
  });

  it("rejects unknown user id", async () => {
    process.env.MCP_USER_ID = "missing";
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    await expect(resolveMcpUser()).rejects.toThrow(
      /MCP_USER_ID does not match/,
    );
  });
});
