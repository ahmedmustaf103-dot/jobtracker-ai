import type { CapabilityResult } from "../../src/lib/capabilities/types";

/** Structured MCP tool response. Never includes env/secrets. */
export function toolSuccess(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

export function toolError(message: string) {
  return {
    isError: true as const,
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({ error: message }, null, 2),
      },
    ],
  };
}

export function fromCapabilityResult<T>(result: CapabilityResult<T>) {
  if (!result.ok) {
    return toolError(result.error);
  }
  return toolSuccess(result.data);
}
