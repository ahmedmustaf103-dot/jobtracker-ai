import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { generateCoverLetterText } from "@/lib/cover-letter/generate";
import { getGeminiErrorMessage } from "@/lib/gemini-errors";
import { rateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { generateCoverLetterSchema } from "@/validations/cover-letter";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimit(
    `cover-letter:${session.user.id}`,
    10,
    60 * 60 * 1000,
  );

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

  const parsed = generateCoverLetterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const candidateName = session.user.name?.trim() || "the candidate";

  try {
    const content = await generateCoverLetterText({
      ...parsed.data,
      candidateName,
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Cover letter API generation failed:", error);
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
