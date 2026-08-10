import { prisma } from "@/lib/db";
import type { CapabilityUser } from "@/lib/capabilities/types";

export class McpAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "McpAuthError";
  }
}

/**
 * Resolve the single trusted local user for an MCP stdio process.
 * Prefers MCP_USER_ID; otherwise looks up MCP_USER_EMAIL.
 * Never accepts caller-supplied user ids in tool arguments.
 */
export async function resolveMcpUser(): Promise<CapabilityUser> {
  const userId = process.env.MCP_USER_ID?.trim();
  const email = process.env.MCP_USER_EMAIL?.trim().toLowerCase();

  if (!userId && !email) {
    throw new McpAuthError(
      "MCP auth is not configured. Set MCP_USER_ID or MCP_USER_EMAIL for this local process.",
    );
  }

  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true },
      })
    : await prisma.user.findUnique({
        where: { email: email! },
        select: { id: true, name: true, email: true },
      });

  if (!user) {
    throw new McpAuthError(
      userId
        ? "MCP_USER_ID does not match any user in the database."
        : "MCP_USER_EMAIL does not match any user in the database.",
    );
  }

  return {
    userId: user.id,
    email: user.email,
    candidateName: user.name?.trim() || "the candidate",
  };
}
