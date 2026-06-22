import { describe, expect, it, beforeEach, vi } from "vitest";

import { rateLimit, rateLimitMessage } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("allows requests under the limit", () => {
    expect(rateLimit("test-key", 3, 60_000).ok).toBe(true);
    expect(rateLimit("test-key", 3, 60_000).ok).toBe(true);
    expect(rateLimit("test-key", 3, 60_000).ok).toBe(true);
  });

  it("blocks requests over the limit", () => {
    rateLimit("block-key", 2, 60_000);
    rateLimit("block-key", 2, 60_000);
    const result = rateLimit("block-key", 2, 60_000);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.retryAfterSec).toBeGreaterThan(0);
    }
  });

  it("resets after the window expires", () => {
    rateLimit("reset-key", 1, 60_000);
    expect(rateLimit("reset-key", 1, 60_000).ok).toBe(false);

    vi.advanceTimersByTime(61_000);
    expect(rateLimit("reset-key", 1, 60_000).ok).toBe(true);
  });

  it("tracks keys independently", () => {
    rateLimit("key-a", 1, 60_000);
    expect(rateLimit("key-a", 1, 60_000).ok).toBe(false);
    expect(rateLimit("key-b", 1, 60_000).ok).toBe(true);
  });
});

describe("rateLimitMessage", () => {
  it("includes retry seconds", () => {
    expect(rateLimitMessage(30)).toContain("30");
  });
});
