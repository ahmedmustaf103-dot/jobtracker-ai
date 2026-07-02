import fs from "fs/promises";
import path from "path";

import { del, put } from "@vercel/blob";

import { hasBlobStorage } from "@/lib/resume/storage-config";

const UPLOAD_ROOT = path.join(process.cwd(), "storage", "uploads", "resumes");

export function getAbsoluteStoragePath(storageKey: string): string {
  return path.join(UPLOAD_ROOT, storageKey);
}

function buildStorageKey(
  userId: string,
  resumeId: string,
  extension: string,
): string {
  return `${userId}/${resumeId}.${extension}`;
}

export async function saveResumeFile(
  userId: string,
  resumeId: string,
  buffer: Buffer,
  extension: string,
): Promise<string> {
  const storageKey = buildStorageKey(userId, resumeId, extension);

  if (hasBlobStorage()) {
    const blob = await put(`resumes/${storageKey}`, buffer, {
      access: "public",
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const dir = path.join(UPLOAD_ROOT, userId);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(getAbsoluteStoragePath(storageKey), buffer);
  return storageKey;
}

export async function deleteResumeFile(storageKey: string): Promise<void> {
  if (storageKey.startsWith("http://") || storageKey.startsWith("https://")) {
    if (hasBlobStorage()) {
      await del(storageKey);
    }
    return;
  }

  try {
    await fs.unlink(getAbsoluteStoragePath(storageKey));
  } catch {
    // File may already be removed.
  }
}
