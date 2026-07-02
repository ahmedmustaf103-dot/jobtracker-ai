import { describe, expect, it, afterEach } from "vitest";

import {
  getResumeStorageMode,
  hasBlobStorage,
  isResumeAnalyzerEnabled,
} from "@/lib/resume/storage-config";

describe("resume storage config", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("uses local storage without a blob token", () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    expect(hasBlobStorage()).toBe(false);
    expect(getResumeStorageMode()).toBe("local");
  });

  it("uses blob storage when token is configured", () => {
    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_test_token";
    expect(hasBlobStorage()).toBe(true);
    expect(getResumeStorageMode()).toBe("blob");
  });

  it("enables resume analyzer when blob storage is available", () => {
    process.env.NODE_ENV = "production";
    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_test_token";
    delete process.env.NEXT_PUBLIC_RESUME_ANALYZER_ENABLED;
    expect(isResumeAnalyzerEnabled()).toBe(true);
  });
});
