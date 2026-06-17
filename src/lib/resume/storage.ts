import fs from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "storage", "uploads", "resumes");

export function getAbsoluteStoragePath(storageKey: string): string {
  return path.join(UPLOAD_ROOT, storageKey);
}

export async function saveResumeFile(
  userId: string,
  resumeId: string,
  buffer: Buffer,
  extension: string,
): Promise<string> {
  const dir = path.join(UPLOAD_ROOT, userId);
  await fs.mkdir(dir, { recursive: true });

  const storageKey = `${userId}/${resumeId}.${extension}`;
  await fs.writeFile(getAbsoluteStoragePath(storageKey), buffer);
  return storageKey;
}

export async function deleteResumeFile(storageKey: string): Promise<void> {
  try {
    await fs.unlink(getAbsoluteStoragePath(storageKey));
  } catch {
    // File may already be removed.
  }
}
