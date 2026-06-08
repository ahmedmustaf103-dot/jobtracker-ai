import type { ApplicationStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

export type ApplicationStats = {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  recent: Awaited<ReturnType<typeof listApplications>>;
};

export async function listApplications(userId: string, limit = 50) {
  return prisma.jobApplication.findMany({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }],
    take: limit,
  });
}

export async function getApplicationStats(userId: string): Promise<ApplicationStats> {
  const [grouped, recent] = await Promise.all([
    prisma.jobApplication.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    }),
    listApplications(userId, 5),
  ]);

  const byStatus = {
    WISHLIST: 0,
    APPLIED: 0,
    SCREENING: 0,
    INTERVIEW: 0,
    OFFER: 0,
    REJECTED: 0,
    WITHDRAWN: 0,
  } satisfies Record<ApplicationStatus, number>;

  for (const row of grouped) {
    byStatus[row.status] = row._count.status;
  }

  const total = Object.values(byStatus).reduce((sum, n) => sum + n, 0);

  return { total, byStatus, recent };
}

export type CreateApplicationInput = Pick<
  Prisma.JobApplicationCreateInput,
  "company" | "title" | "location" | "url" | "status" | "salary" | "notes"
>;
