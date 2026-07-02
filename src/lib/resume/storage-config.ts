/** Server-only resume storage configuration. */
export function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function isResumeAnalyzerEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    hasBlobStorage() ||
    process.env.NEXT_PUBLIC_RESUME_ANALYZER_ENABLED === "true"
  );
}

export function getResumeStorageMode(): "blob" | "local" {
  return hasBlobStorage() ? "blob" : "local";
}
