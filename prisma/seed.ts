import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedApplication(
  userId: string,
  data: {
    company: string;
    title: string;
    status: "WISHLIST" | "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER";
    location: string;
    appliedAt?: Date;
    notes?: string;
    events: Array<{
      type: "CREATED" | "STATUS_CHANGED" | "NOTE";
      fromStatus?: "WISHLIST" | "APPLIED" | "SCREENING" | "INTERVIEW";
      toStatus?: "WISHLIST" | "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER";
      note?: string;
      createdAt: Date;
    }>;
  },
) {
  const application = await prisma.jobApplication.create({
    data: {
      userId,
      company: data.company,
      title: data.title,
      status: data.status,
      location: data.location,
      appliedAt: data.appliedAt,
      notes: data.notes,
    },
  });

  await prisma.applicationEvent.createMany({
    data: data.events.map((event) => ({
      applicationId: application.id,
      userId,
      type: event.type,
      fromStatus: event.fromStatus,
      toStatus: event.toStatus,
      note: event.note,
      createdAt: event.createdAt,
    })),
  });
}

async function main() {
  const email = "demo@jobtracker.ai";
  const passwordHash = await hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Demo User",
      email,
      passwordHash,
    },
  });

  await prisma.jobApplication.deleteMany({ where: { userId: user.id } });

  const now = Date.now();
  const daysAgo = (days: number) => new Date(now - days * 24 * 60 * 60 * 1000);

  await seedApplication(user.id, {
    company: "Acme Corp",
    title: "Senior Frontend Engineer",
    status: "INTERVIEW",
    location: "Remote",
    appliedAt: daysAgo(14),
    notes: "Strong React/Next.js focus. Hiring manager mentioned pair programming round.",
    events: [
      {
        type: "CREATED",
        toStatus: "WISHLIST",
        createdAt: daysAgo(21),
      },
      {
        type: "STATUS_CHANGED",
        fromStatus: "WISHLIST",
        toStatus: "APPLIED",
        createdAt: daysAgo(14),
      },
      {
        type: "NOTE",
        note: "Submitted application via company careers page.",
        createdAt: daysAgo(14),
      },
      {
        type: "STATUS_CHANGED",
        fromStatus: "APPLIED",
        toStatus: "SCREENING",
        createdAt: daysAgo(7),
      },
      {
        type: "STATUS_CHANGED",
        fromStatus: "SCREENING",
        toStatus: "INTERVIEW",
        createdAt: daysAgo(2),
      },
      {
        type: "NOTE",
        note: "Technical interview scheduled for Thursday 2pm.",
        createdAt: daysAgo(1),
      },
    ],
  });

  await seedApplication(user.id, {
    company: "Northwind Labs",
    title: "Full Stack Developer",
    status: "APPLIED",
    location: "New York, NY",
    appliedAt: daysAgo(5),
    events: [
      {
        type: "CREATED",
        toStatus: "WISHLIST",
        createdAt: daysAgo(8),
      },
      {
        type: "STATUS_CHANGED",
        fromStatus: "WISHLIST",
        toStatus: "APPLIED",
        createdAt: daysAgo(5),
      },
    ],
  });

  await seedApplication(user.id, {
    company: "Globex",
    title: "Staff Engineer",
    status: "WISHLIST",
    location: "San Francisco, CA",
    events: [
      {
        type: "CREATED",
        toStatus: "WISHLIST",
        createdAt: daysAgo(3),
      },
    ],
  });

  console.log("Seed complete:", { email, password: "password123" });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
