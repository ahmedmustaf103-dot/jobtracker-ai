import { prisma } from "@/lib/db";

export type CreateCoverLetterInput = {
  company: string;
  role: string;
  jobDescription: string;
  content: string;
};

export async function listCoverLetters(userId: string, limit = 20) {
  return prisma.coverLetter.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getCoverLetterById(userId: string, id: string) {
  return prisma.coverLetter.findFirst({ where: { id, userId } });
}

export async function createCoverLetter(
  userId: string,
  data: CreateCoverLetterInput,
) {
  return prisma.coverLetter.create({
    data: {
      company: data.company,
      role: data.role,
      jobDescription: data.jobDescription,
      content: data.content,
      user: { connect: { id: userId } },
    },
  });
}

export async function updateCoverLetterContent(
  userId: string,
  id: string,
  content: string,
) {
  const existing = await getCoverLetterById(userId, id);
  if (!existing) return null;

  return prisma.coverLetter.update({
    where: { id },
    data: { content },
  });
}

export async function deleteCoverLetter(userId: string, id: string) {
  const existing = await getCoverLetterById(userId, id);
  if (!existing) return false;

  await prisma.coverLetter.delete({ where: { id } });
  return true;
}
