import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import type { ResumeAnalysisPayload, ResumeAnalysisRecord } from "@/types/resume";

export async function listResumeAnalyses(userId: string, limit = 20) {
  return prisma.resumeAnalysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      resume: {
        select: { fileName: true, extractedText: true },
      },
    },
  });
}

export async function getResumeAnalysisById(userId: string, id: string) {
  return prisma.resumeAnalysis.findFirst({
    where: { id, userId },
    include: {
      resume: {
        select: {
          id: true,
          fileName: true,
          extractedText: true,
        },
      },
    },
  });
}

export async function getResumeById(userId: string, id: string) {
  return prisma.resume.findFirst({
    where: { id, userId },
  });
}

type CreateResumeInput = {
  fileName: string;
  mimeType: string;
  fileSize: number;
  storageKey: string;
  extractedText: string;
};

export async function createResume(userId: string, data: CreateResumeInput) {
  return prisma.resume.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
}

export async function updateResume(
  userId: string,
  resumeId: string,
  data: Partial<Pick<CreateResumeInput, "storageKey" | "extractedText">>,
) {
  const existing = await getResumeById(userId, resumeId);
  if (!existing) return null;

  return prisma.resume.update({
    where: { id: resumeId },
    data,
  });
}

export async function createResumeAnalysis(
  userId: string,
  resumeId: string,
  analysis: ResumeAnalysisPayload,
) {
  return prisma.resumeAnalysis.create({
    data: {
      userId,
      resumeId,
      score: analysis.score,
      strengths: analysis.strengths as Prisma.InputJsonValue,
      weaknesses: analysis.weaknesses as Prisma.InputJsonValue,
      missingSkills: analysis.missingSkills as Prisma.InputJsonValue,
      atsSuggestions: analysis.atsSuggestions as Prisma.InputJsonValue,
      improvements: analysis.improvements as Prisma.InputJsonValue,
      keywords: analysis.keywords as Prisma.InputJsonValue,
    },
    include: {
      resume: { select: { fileName: true, extractedText: true } },
    },
  });
}

export async function deleteResumeAnalysis(userId: string, id: string) {
  const existing = await getResumeAnalysisById(userId, id);
  if (!existing) return false;

  await prisma.resumeAnalysis.delete({ where: { id } });
  return true;
}

export async function deleteResume(userId: string, id: string) {
  const existing = await getResumeById(userId, id);
  if (!existing) return null;

  await prisma.resume.delete({ where: { id } });
  return existing;
}

export function mapAnalysisRecord(
  record: Awaited<ReturnType<typeof createResumeAnalysis>>,
) {
  return mapAnalysisFromDb(record);
}

export function mapAnalysisFromDb(
  record: Awaited<ReturnType<typeof listResumeAnalyses>>[number],
): ResumeAnalysisRecord {
  return {
    id: record.id,
    resumeId: record.resumeId,
    fileName: record.resume.fileName,
    extractedText: record.resume.extractedText,
    createdAt: record.createdAt.toISOString(),
    score: record.score,
    strengths: record.strengths as string[],
    weaknesses: record.weaknesses as string[],
    missingSkills: record.missingSkills as string[],
    atsSuggestions: record.atsSuggestions as string[],
    improvements: record.improvements as string[],
    keywords: record.keywords as ResumeAnalysisPayload["keywords"],
  };
}
