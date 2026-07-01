import type { ApplicationStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

export type ApplicationStats = {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  recent: Awaited<ReturnType<typeof listApplications>>;
};

type ListApplicationsOptions = {
  limit?: number;
  status?: ApplicationStatus;
};

export async function listApplications(
  userId: string,
  options: ListApplicationsOptions = {},
) {
  const { limit = 50, status } = options;

  return prisma.jobApplication.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
    },
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
    listApplications(userId, { limit: 5 }),
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

export async function getApplicationById(userId: string, id: string) {
  return prisma.jobApplication.findFirst({
    where: { id, userId },
  });
}

export async function getApplicationWithEvents(userId: string, id: string) {
  return prisma.jobApplication.findFirst({
    where: { id, userId },
    include: {
      events: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createApplication(
  userId: string,
  data: CreateApplicationInput,
) {
  const status = data.status ?? "WISHLIST";

  return prisma.$transaction(async (tx) => {
    const application = await tx.jobApplication.create({
      data: {
        company: data.company,
        title: data.title,
        location: data.location,
        url: data.url,
        status,
        salary: data.salary,
        notes: data.notes,
        appliedAt: status === "APPLIED" ? new Date() : undefined,
        user: { connect: { id: userId } },
      },
    });

    await tx.applicationEvent.create({
      data: {
        applicationId: application.id,
        userId,
        type: "CREATED",
        toStatus: status,
      },
    });

    return application;
  });
}

export async function updateApplication(
  userId: string,
  id: string,
  data: CreateApplicationInput,
) {
  const existing = await getApplicationById(userId, id);
  if (!existing) return null;

  const appliedAt =
    data.status === "APPLIED" && !existing.appliedAt
      ? new Date()
      : existing.appliedAt;

  const statusChanged = data.status !== existing.status;

  return prisma.$transaction(async (tx) => {
    const application = await tx.jobApplication.update({
      where: { id },
      data: {
        company: data.company,
        title: data.title,
        location: data.location,
        url: data.url,
        status: data.status,
        salary: data.salary,
        notes: data.notes,
        appliedAt,
      },
    });

    if (statusChanged) {
      await tx.applicationEvent.create({
        data: {
          applicationId: id,
          userId,
          type: "STATUS_CHANGED",
          fromStatus: existing.status,
          toStatus: data.status,
        },
      });
    }

    return application;
  });
}

export async function updateApplicationStatus(
  userId: string,
  id: string,
  status: ApplicationStatus,
) {
  const existing = await getApplicationById(userId, id);
  if (!existing) return null;
  if (existing.status === status) return existing;

  const appliedAt =
    status === "APPLIED" && !existing.appliedAt
      ? new Date()
      : existing.appliedAt;

  return prisma.$transaction(async (tx) => {
    const application = await tx.jobApplication.update({
      where: { id },
      data: { status, appliedAt },
    });

    await tx.applicationEvent.create({
      data: {
        applicationId: id,
        userId,
        type: "STATUS_CHANGED",
        fromStatus: existing.status,
        toStatus: status,
      },
    });

    return application;
  });
}

export async function addApplicationNote(
  userId: string,
  applicationId: string,
  note: string,
) {
  const existing = await getApplicationById(userId, applicationId);
  if (!existing) return null;

  const [event] = await prisma.$transaction([
    prisma.applicationEvent.create({
      data: {
        applicationId,
        userId,
        type: "NOTE",
        note,
      },
    }),
    prisma.jobApplication.update({
      where: { id: applicationId },
      data: { updatedAt: new Date() },
    }),
  ]);

  return event;
}

export async function deleteApplication(userId: string, id: string) {
  const existing = await getApplicationById(userId, id);
  if (!existing) return false;

  await prisma.jobApplication.delete({ where: { id } });
  return true;
}
