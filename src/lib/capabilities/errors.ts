/**
 * Map unexpected errors to safe, user-facing capability messages.
 * Never leak secrets, connection strings, or stack traces.
 */
export function sanitizeCapabilityError(
  error: unknown,
  fallback: string,
): string {
  if (!(error instanceof Error) || !error.message?.trim()) {
    return fallback;
  }

  const message = error.message.trim();
  const lower = message.toLowerCase();

  if (
    lower.includes("password") ||
    lower.includes("secret") ||
    lower.includes("api_key") ||
    lower.includes("api key") ||
    lower.includes("authorization") ||
    lower.includes("bearer ") ||
    lower.includes("database_url") ||
    lower.includes("postgresql://") ||
    lower.includes("mongodb://") ||
    lower.includes("aizasy") ||
    lower.includes("sk-") ||
    /aq\.[a-z0-9]/i.test(message)
  ) {
    return fallback;
  }

  if (
    lower.includes("unique constraint") ||
    lower.includes("foreign key") ||
    lower.includes("prisma")
  ) {
    return "Could not complete that database update. Check the input and try again.";
  }

  if (message.includes("\n") || message.length > 200) {
    return fallback;
  }

  return message;
}

export function capabilityValidationError(message: string) {
  return { ok: false as const, error: message };
}

export function capabilityUnknownError(error: unknown, fallback: string) {
  return {
    ok: false as const,
    error: sanitizeCapabilityError(error, fallback),
  };
}
