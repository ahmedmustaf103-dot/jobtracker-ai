import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

  await prisma.jobApplication.createMany({
    data: [
      {
        userId: user.id,
        company: "Acme Corp",
        title: "Senior Frontend Engineer",
        status: "INTERVIEW",
        location: "Remote",
        appliedAt: new Date(),
      },
      {
        userId: user.id,
        company: "Northwind Labs",
        title: "Full Stack Developer",
        status: "APPLIED",
        location: "New York, NY",
        appliedAt: new Date(),
      },
      {
        userId: user.id,
        company: "Globex",
        title: "Staff Engineer",
        status: "WISHLIST",
        location: "San Francisco, CA",
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
