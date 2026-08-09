import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { runJobSearchAgent } from "@/lib/agent/orchestrate";
import { auth } from "@/lib/auth";
import { getGeminiErrorMessage } from "@/lib/gemini-errors";
import { rateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { agentChatRequestSchema } from "@/validations/agent";

const MUTATING_TOOLS = new Set([
  "save_application",
  "update_application_status",
]);

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimit(`agent-chat:${session.user.id}`, 20, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: rateLimitMessage(limited.retryAfterSec) },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = agentChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const last = parsed.data.messages[parsed.data.messages.length - 1];
  if (last?.role !== "user") {
    return NextResponse.json(
      { error: "The last message must be from the user." },
      { status: 400 },
    );
  }

  try {
    const result = await runJobSearchAgent(parsed.data.messages, {
      userId: session.user.id,
      candidateName: session.user.name?.trim() || "the candidate",
    });

    if (result.toolCalls.some((call) => MUTATING_TOOLS.has(call.name))) {
      revalidatePath("/applications");
      revalidatePath("/dashboard");
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Agent chat failed:", error);
    const message = getGeminiErrorMessage(error);
    const status =
      message.includes("quota") ||
      message.includes("rate limit") ||
      message.includes("Rate limit")
        ? 429
        : 502;

    return NextResponse.json({ error: message }, { status });
  }
}
